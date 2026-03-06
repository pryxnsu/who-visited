// this API route handles site verification for a given site ID.
// It supports three verification methods: DNS TXT record, meta tag, and text file.
// The route checks the provided verification method against the site's verification token and updates the site's verification status accordingly.

import { resolveTxt } from 'node:dns/promises';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { normalizeDomain } from '@/lib/domain';
import { getSiteByIdAndUserId, updateSiteVerification } from '@/lib/db/queries';
import { HTTP_STATUS } from '@/lib/constant';
import ApiResponse from '@/lib/ApiResponse';
import { verifySiteSchema } from '@/types/schema';
import type { SiteVerificationMethod } from '@/types/site';

const VERIFY_TIMEOUT_MS = 9000;
const META_NAME = 'whovisited-verification';

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasVerificationMetaTag(html: string, token: string) {
  console.log('Before token:', token);
  const escaped = escapeRegExp(token);
  console.log('After escaping token for regex:', escaped);

  const nameThenContent = new RegExp(`<meta[^>]*name=["']${META_NAME}["'][^>]*content=["']${escaped}["'][^>]*>`, 'i');
  const contentThenName = new RegExp(`<meta[^>]*content=["']${escaped}["'][^>]*name=["']${META_NAME}["'][^>]*>`, 'i');

  return nameThenContent.test(html) || contentThenName.test(html);
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    headers: {
      'user-agent': 'WhoVisitedVerifier/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} at ${url}`);
  }

  return response.text();
}

async function verifyDnsTxt(domain: string, token: string) {
  const recordName = `_whovisited.${domain}`;
  const expected = `whovisited=${token}`;

  try {
    const records = await resolveTxt(recordName);
    console.log(`DNS TXT records for ${recordName}:`, records);
    const values = records.map(parts => parts.join('').trim());
    console.log(`Normalized TXT values for ${recordName}:`, values);
    const matched = values.some(value => value === expected || value === token);

    return {
      matched,
      checkedLocation: recordName,
      expectedValue: expected,
      reason: matched ? null : `TXT record was found, but expected value "${expected}" is missing.`,
    };
  } catch (error) {
    return {
      matched: false,
      checkedLocation: recordName,
      expectedValue: expected,
      reason: error instanceof Error ? error.message : 'DNS lookup failed.',
    };
  }
}

async function verifyMetaTag(domain: string, token: string) {
  const urls = [`https://${domain}`, `http://${domain}`];
  const expectedValue = `<meta name="${META_NAME}" content="${token}" />`;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      const html = await fetchText(url);
      if (hasVerificationMetaTag(html, token)) {
        return { matched: true, checkedLocation: url, expectedValue, reason: null };
      }
    } catch {
      console.error(`Error fetching homepage for meta tag verification at ${url}`);

      if (i === urls.length - 1) {
        console.error('All URL variants failed for meta tag verification.');
      } else {
        console.warn(`Verification failed for ${url}, trying next variant`);
      }
    }
  }

  return {
    matched: false,
    checkedLocation: urls[0],
    expectedValue,
    reason: `Meta tag ${expectedValue} was not found on the homepage.`,
  };
}

async function verifyTextFile(domain: string, token: string) {
  const urls = [`https://${domain}/.well-known/whovisited.txt`, `http://${domain}/.well-known/whovisited.txt`];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      const body = (await fetchText(url)).trim();

      if (body === token || body.includes(token)) {
        return { matched: true, checkedLocation: url, expectedValue: token, reason: null };
      }
    } catch {
      console.error(`Error fetching verification file at ${url}`);
      if (i === urls.length - 1) {
        console.error('All URL variants failed for text file verification.');
      } else {
        console.warn(`Verification failed for ${url}, trying next variant`);
      }
    }
  }

  return {
    matched: false,
    checkedLocation: urls[0],
    expectedValue: token,
    reason: 'Verification token was not found in .well-known/whovisited.txt',
  };
}

async function verifyByMethod(method: SiteVerificationMethod, domain: string, token: string) {
  if (method === 'dns_txt') {
    return verifyDnsTxt(domain, token);
  }

  if (method === 'meta_tag') {
    return verifyMetaTag(domain, token);
  }

  return verifyTextFile(domain, token);
}

// POST - api/sites/[siteId]/verify
export async function POST(request: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json(new ApiResponse(HTTP_STATUS.UNAUTHORIZED, false, null, 'Unauthorized'), {
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  }

  const { siteId } = await params;
  if (!siteId) {
    return NextResponse.json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, false, null, 'Site ID is required'), {
      status: HTTP_STATUS.BAD_REQUEST,
    });
  }

  const site = await getSiteByIdAndUserId(siteId, user.id);
  if (!site) {
    return NextResponse.json(new ApiResponse(HTTP_STATUS.NOT_FOUND, false, null, 'Site not found or unauthorized'), {
      status: HTTP_STATUS.NOT_FOUND,
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, false, null, 'Invalid request body'), {
      status: HTTP_STATUS.BAD_REQUEST,
    });
  }

  const result = verifySiteSchema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues.map(issue => issue.message).join(', ');
    return NextResponse.json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, false, null, message), {
      status: HTTP_STATUS.BAD_REQUEST,
    });
  }

  const method = result.data.method;
  const domain = normalizeDomain(site.domain);

  if (!domain) {
    return NextResponse.json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, false, null, 'Site domain is invalid'), {
      status: HTTP_STATUS.BAD_REQUEST,
    });
  }

  const check = await verifyByMethod(method, domain, site.verificationToken);

  if (!check.matched) {
    const failed = await updateSiteVerification(site.id, user.id, {
      verificationStatus: 'failed',
      verificationMethod: method,
      verifiedAt: null,
    });

    return NextResponse.json(
      new ApiResponse(HTTP_STATUS.BAD_REQUEST, false, failed, `Verification failed. ${check.reason ?? ''}`.trim()),
      { status: HTTP_STATUS.BAD_REQUEST }
    );
  }

  const verified = await updateSiteVerification(site.id, user.id, {
    verificationStatus: 'verified',
    verificationMethod: method,
    verifiedAt: new Date(),
  });

  return NextResponse.json(
    new ApiResponse(HTTP_STATUS.OK, true, verified, `Domain verified using ${method.replace('_', ' ')}.`),
    { status: HTTP_STATUS.OK }
  );
}
