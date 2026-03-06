// this route handles incoming tracking requests from the client-side script

import { NextRequest, NextResponse } from 'next/server';
import { entryVisitor, getSiteBySiteId } from '@/lib/db/queries';
import { normalizeDomain } from '@/lib/domain';
import { HTTP_STATUS } from '@/lib/constant';
import { trackSchema } from '@/types/schema';
import { serverEnv } from '@/env/server';
import crypto from 'crypto';

type TrackPayload = {
  siteId?: unknown;
  path?: unknown;
  referrer?: unknown;
  userAgent?: unknown;
  timezone?: unknown;
  language?: unknown;
  platform?: unknown;
  timestamp?: unknown;
  screen?: unknown;
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
  Vary: 'Origin',
} as const;

function toStringValue(value: unknown, fallback: string, maxLength: number) {
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim();
  if (!normalized) return fallback;
  return normalized.slice(0, maxLength);
}

function normalizePath(value: unknown) {
  const path = toStringValue(value, '/', 512);
  try {
    const url = new URL(path, 'http://whovisited.local');

    let pathname = url.pathname;
    pathname = pathname.replace(/\/{2,}/g, '/');

    if (!pathname.startsWith('/')) {
      pathname = `/${pathname}`;
    }

    // remove duplicate slashes
    pathname = pathname.replace(/\/{2,}/g, '/');

    return pathname.slice(0, 512);
  } catch {
    return '/';
  }
}

function normalizeReferrer(value: unknown) {
  const raw = toStringValue(value, 'Direct', 512);
  if (raw === 'Direct') return raw;

  try {
    return new URL(raw).hostname.slice(0, 255);
  } catch {
    return raw;
  }
}

function extractHostnameFromUrl(value: string | null) {
  if (!value) return null;

  const candidate = value.trim();
  if (!candidate || candidate === '*' || candidate === 'null') return null;

  try {
    const parsed = new URL(candidate);
    return normalizeDomain(parsed.hostname);
  } catch {
    return null;
  }
}

function getRequestSiteHost(request: NextRequest) {
  const originHost = extractHostnameFromUrl(request.headers.get('origin'));
  if (originHost) return originHost;

  const refererHost = extractHostnameFromUrl(request.headers.get('referer'));
  if (refererHost) return refererHost;

  return null;
}

function getBrowserName(userAgent: string) {
  const ua = userAgent.toLowerCase();
  if (ua.includes('edg/')) return 'Edge';
  if (ua.includes('chrome/') && !ua.includes('edg/')) return 'Chrome';
  if (ua.includes('safari/') && !ua.includes('chrome/')) return 'Safari';
  if (ua.includes('firefox/')) return 'Firefox';
  if (ua.includes('opr/') || ua.includes('opera/')) return 'Opera';
  return 'Unknown';
}

function getOsName(userAgent: string) {
  const ua = userAgent.toLowerCase();
  if (ua.includes('windows nt')) return 'Windows';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) return 'iOS';
  if (ua.includes('mac os x') || ua.includes('macintosh')) return 'macOS';
  if (ua.includes('linux')) return 'Linux';
  return 'Unknown';
}

function getDeviceType(userAgent: string) {
  const ua = userAgent.toLowerCase();
  if (ua.includes('tablet') || ua.includes('ipad')) return 'tablet';
  if (ua.includes('mobi') || ua.includes('android')) return 'mobile';
  return 'desktop';
}

const LOCALHOSTS = new Set(['127.0.0.1', '::1']);

function normalizeIp(rawIp: string) {
  const ip = rawIp.trim();
  if (!ip) return 'unknown';

  const normalized = ip.toLowerCase();

  if (normalized.startsWith('::ffff:')) {
    const mappedIp = normalized.slice(7);
    return LOCALHOSTS.has(mappedIp) ? 'localhost' : mappedIp;
  }

  return LOCALHOSTS.has(normalized) ? 'localhost' : ip;
}

function getIpAddress(request: NextRequest) {
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return normalizeIp(cfConnectingIp).slice(0, 100);

  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return normalizeIp(forwardedFor.split(',')[0]?.trim() ?? '127.0.0.1').slice(0, 100);
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return normalizeIp(realIp).slice(0, 100);

  return 'localhost';
}

function hashIpAddress(siteId: string, ip: string) {
  const hmac = crypto.createHmac('sha256', serverEnv.NEXTAUTH_SECRET);
  hmac.update(`${siteId}:${ip}`);
  return hmac.digest('hex');
}

function getGeoLocation(request: NextRequest) {
  const countryRaw = request.headers.get('x-vercel-ip-country') ?? request.headers.get('cf-ipcountry');
  const cityRaw = request.headers.get('x-vercel-ip-city');

  const country = typeof countryRaw === 'string' ? countryRaw.trim().toUpperCase() : '';
  const city = typeof cityRaw === 'string' ? cityRaw.trim() : '';

  return {
    country: /^[A-Z]{2}$/.test(country) ? country : null,
    city: city ? city.slice(0, 120) : null,
  };
}

function getBotReasonFromRequest(request: NextRequest): string | null {
  const ua = request.headers.get('user-agent');
  const botRegex = /bot|spider|crawler|curl|wget|python|scrapy|headless|puppeteer|playwright/i;

  if (!ua) return 'missing_user_agent';

  if (botRegex.test(ua)) return 'ua_bot_signature';

  if (!request.headers.get('accept-language')) return 'missing_accept_language';

  return null;
}

async function parsePayload(request: NextRequest): Promise<TrackPayload> {
  try {
    const text = await request.text();
    if (!text.trim()) return {};
    return JSON.parse(text);
  } catch (err) {
    console.warn('Failed to parse tracking payload:', err);
    return {};
  }
}

const RATE_WINDOW_MS = 10_000;
const RATE_BOT_THRESHOLD = 20;
const RATE_BUCKET_TTL_MS = 5 * 60 * 1000;
const RATE_CLEANUP_INTERVAL_MS = 60 * 1000;

type RateBucket = {
  count: number;
  windowStartedAt: number;
  lastSeenAt: number;
};

// siteId:ipHash:path -> rolling request bucket
const reqMap = new Map<string, RateBucket>();
let lastReqMapCleanupAt = 0;

// Run cleanup at most once per minute; remove buckets inactive for over 5 minutes
function cleanupReqMap(now: number) {
  if (now - lastReqMapCleanupAt < RATE_CLEANUP_INTERVAL_MS) return;
  lastReqMapCleanupAt = now;

  for (const [key, bucket] of reqMap.entries()) {
    if (now - bucket.lastSeenAt > RATE_BUCKET_TTL_MS) {
      reqMap.delete(key);
    }
  }
}

function getRateInfo(key: string, now: number) {
  const current = reqMap.get(key);

  if (!current || now - current.windowStartedAt > RATE_WINDOW_MS) {
    const nextBucket: RateBucket = {
      count: 1,
      windowStartedAt: now,
      lastSeenAt: now,
    };
    reqMap.set(key, nextBucket);
    return { count: nextBucket.count, isRateBot: false };
  }

  const nextCount = current.count + 1;
  reqMap.set(key, {
    count: nextCount,
    windowStartedAt: current.windowStartedAt,
    lastSeenAt: now,
  });

  return {
    count: nextCount,
    isRateBot: nextCount >= RATE_BOT_THRESHOLD,
  };
}

// POST - /api/track
export async function POST(request: NextRequest) {
  try {
    const raw = await parsePayload(request);

    const result = trackSchema.safeParse(raw);
    if (!result.success) {
      return new NextResponse(null, { status: HTTP_STATUS.BAD_REQUEST, headers: CORS_HEADERS });
    }

    const payload = result.data;
    const path = normalizePath(payload.path);

    const existingSite = await getSiteBySiteId(payload.siteId);
    if (!existingSite) {
      return NextResponse.json(
        { ok: false, error: 'Site not found. Please register your site first.' },
        { status: HTTP_STATUS.NOT_FOUND, headers: CORS_HEADERS }
      );
    }

    if (existingSite.verificationStatus !== 'verified') {
      return NextResponse.json(
        { ok: false, error: 'Site domain is not verified yet.' },
        { status: HTTP_STATUS.FORBIDDEN, headers: CORS_HEADERS }
      );
    }

    const requestSiteHost = getRequestSiteHost(request);
    if (!requestSiteHost) {
      return NextResponse.json(
        { ok: false, error: 'Missing or invalid request origin.' },
        { status: HTTP_STATUS.BAD_REQUEST, headers: CORS_HEADERS }
      );
    }

    const registeredHost = normalizeDomain(existingSite.domain);
    if (requestSiteHost !== registeredHost) {
      return NextResponse.json(
        { ok: false, error: 'Request origin does not match the registered site domain.' },
        { status: HTTP_STATUS.BAD_REQUEST, headers: CORS_HEADERS }
      );
    }

    const rawUA = request.headers.get('user-agent') ?? 'Unknown';

    const userAgent = rawUA.slice(0, 512);
    const browser = getBrowserName(userAgent).slice(0, 120);
    const os = getOsName(userAgent).slice(0, 80);
    const device = getDeviceType(userAgent).slice(0, 40);
    const referrer = normalizeReferrer(request.headers.get('referer'));
    const geo = getGeoLocation(request);

    const ip = getIpAddress(request);
    const hashedIp = hashIpAddress(payload.siteId, ip);

    // bot detection
    const key = `${existingSite.id}:${hashedIp}:${path}`;
    const now = Date.now();

    cleanupReqMap(now);

    const { isRateBot } = getRateInfo(key, now);

    const botReasonFromRequest = getBotReasonFromRequest(request);
    const rateBotReason = isRateBot ? 'rate_limit_exceeded' : null;
    const botReason = botReasonFromRequest ?? rateBotReason;
    const isBot = botReason !== null;

    await entryVisitor({
      siteId: payload.siteId,
      ip: hashedIp,
      browser,
      os,
      device,
      referrer,
      path,
      isBot,
      botReason,
      country: geo.country,
      city: geo.city,
    });

    return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT, headers: CORS_HEADERS });
  } catch (error) {
    console.error('Tracking error:', error);
    return new NextResponse(null, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR, headers: CORS_HEADERS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT, headers: CORS_HEADERS });
}
