import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { deleteSite } from '@/lib/db/queries';
import { HTTP_STATUS } from '@/lib/constant';
import ApiResponse from '@/lib/ApiResponse';

// DELETE - api/sites/[siteId]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json(new ApiResponse(HTTP_STATUS.UNAUTHORIZED, false, null, 'Unauthorized'));

  const { siteId } = await params;

  if (!siteId) {
    return NextResponse.json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, false, null, 'Site ID is required'));
  }

  try {
    const deleted = await deleteSite(siteId, user.id);
    if (!deleted) {
      return NextResponse.json(new ApiResponse(HTTP_STATUS.NOT_FOUND, false, null, 'Site not found or unauthorized'));
    }

    return NextResponse.json(new ApiResponse(HTTP_STATUS.OK, true, deleted, 'Site deleted successfully'));
  } catch (err) {
    console.log(err);
    return NextResponse.json(new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, false, null, 'Failed to delete site'));
  }
}
