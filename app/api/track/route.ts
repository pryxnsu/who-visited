import { NextRequest, NextResponse } from 'next/server';
import { entryVisitor, getSiteBySiteId } from '@/lib/db/queries';
import { HTTP_STATUS } from '@/lib/constant';
import { trackSchema } from '@/types/schema';

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

    const rawUA = request.headers.get('user-agent') ?? 'Unknown';

    const userAgent = rawUA.slice(0, 512);
    const browser = getBrowserName(userAgent).slice(0, 120);
    const os = getOsName(userAgent).slice(0, 80);
    const device = getDeviceType(userAgent).slice(0, 40);
    const referrer = normalizeReferrer(request.headers.get('referer'));
    const geo = getGeoLocation(request);

    await entryVisitor({
      siteId: payload.siteId,
      ip: getIpAddress(request),
      browser,
      os,
      device,
      referrer,
      path,
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
