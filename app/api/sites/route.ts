import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { createSite, getSitesByUserId } from '@/lib/db/queries';
import { HTTP_STATUS } from '@/lib/constant';
import ApiResponse from '@/lib/ApiResponse';
import { getAuthUser } from '@/lib/auth';
import { normalizeDomain } from '@/lib/domain';
import { addSiteSchema } from '@/types/schema';

function createVerificationToken() {
  return randomBytes(24).toString('hex');
}

// GET - api/sites
export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json(new ApiResponse(HTTP_STATUS.UNAUTHORIZED, false, null, 'Unauthorized'));

  const userId = user.id;

  try {
    const sites = await getSitesByUserId(userId);
    return NextResponse.json(new ApiResponse(HTTP_STATUS.OK, true, sites, 'Sites fetched successfully'));
  } catch (err) {
    console.log('Error occured in /api/sites', err);
    return NextResponse.json(new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, false, null, 'Failed to fetch sites'));
  }
}

// POST - api/sites
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json(new ApiResponse(HTTP_STATUS.UNAUTHORIZED, false, null, 'Unauthorized'));

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, false, null, 'Invalid request body'), {
      status: HTTP_STATUS.BAD_REQUEST,
    });
  }

  const result = addSiteSchema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues.map(issue => `${issue.message}`).join(', ');

    return NextResponse.json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, false, null, message), {
      status: HTTP_STATUS.BAD_REQUEST,
    });
  }

  const name = result.data.name.trim();
  const domain = normalizeDomain(result.data.domain);

  if (!domain) {
    return NextResponse.json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, false, null, 'Domain is required'), {
      status: HTTP_STATUS.BAD_REQUEST,
    });
  }

  const userId = user.id;
  try {
    const site = await createSite({
      userId,
      name,
      domain,
      verificationToken: createVerificationToken(),
    });

    return NextResponse.json(new ApiResponse(HTTP_STATUS.CREATED, true, site, 'Site created successfully'));
  } catch (err) {
    if (err instanceof Error && err.message.includes('unique')) {
      return NextResponse.json(
        new ApiResponse(HTTP_STATUS.CONFLICT, false, null, 'This domain is already registered.'),
        { status: HTTP_STATUS.CONFLICT }
      );
    }
    return NextResponse.json(new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, false, null, 'Failed to create site'));
  }
}
