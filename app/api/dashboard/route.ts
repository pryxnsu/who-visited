import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getSiteBySiteId, getSitesByUserId } from '@/lib/db/queries';
import { getSummaryStats } from '@/lib/dashboard/summary';
import { getVisitsTrend } from '@/lib/dashboard/trend';
import { getRecentActivity } from '@/lib/dashboard/activity';
import { getTopPages, getTopReferrers } from '@/lib/dashboard/top-entries';
import ApiResponse from '@/lib/ApiResponse';
import { HTTP_STATUS } from '@/lib/constant';
import type { DashboardData } from '@/types/dashboard';

// GET - api/dashboard
export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json(new ApiResponse(HTTP_STATUS.UNAUTHORIZED, false, null, 'Unauthorized'), {
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const requestedSiteId = searchParams.get('siteId')?.trim();

    let siteId: string | null = null;

    if (requestedSiteId) {
      const selectedSite = await getSiteBySiteId(requestedSiteId);
      if (selectedSite && selectedSite.userId === user.id) {
        siteId = selectedSite.id;
      }
    }

    if (!siteId) {
      const [fallbackSite] = await getSitesByUserId(user.id, 1);
      if (!fallbackSite) {
        return NextResponse.json(
          new ApiResponse(HTTP_STATUS.OK, true, null, 'No sites registered. Add a site to continue.'),
          { status: HTTP_STATUS.OK }
        );
      }
      siteId = fallbackSite.id;
    }

    const [summary, trend, recentActivity] = await Promise.all([
      getSummaryStats(siteId),
      getVisitsTrend(siteId),
      getRecentActivity(siteId),
    ]);

    const [topPages, topReferrers] = await Promise.all([
      getTopPages(siteId, summary.totalVisits),
      getTopReferrers(siteId, summary.totalVisits),
    ]);

    // console.log('top pages', topPages);
    // console.log('-----------------\n');
    // console.log('top referrers', topReferrers);

    const result: DashboardData = {
      siteId,
      summary,
      trend,
      topPages,
      topReferrers,
      highlights: [
        { label: 'Top referrer', value: summary.topReferrer ?? 'No data yet' },
        { label: 'Top browser', value: summary.topBrowser ?? 'No data yet' },
        { label: 'Top page', value: summary.topPage ?? 'No data yet' },
      ],
      recentActivity,
    };

    return NextResponse.json(new ApiResponse(HTTP_STATUS.OK, true, result, 'Dashboard data fetched successfully'));
  } catch (err) {
    console.error('Dashboard data fetch failed:', err);
    return NextResponse.json(
      new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, false, null, 'Failed to fetch dashboard data'),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
