import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { deleteUserById } from '@/lib/db/queries';
import { HTTP_STATUS } from '@/lib/constant';
import ApiResponse from '@/lib/ApiResponse';

// DELETE - /api/account
export async function DELETE(request: NextRequest) {
  const authUser = await getAuthUser(request);
  if (!authUser) {
    return NextResponse.json(new ApiResponse(HTTP_STATUS.UNAUTHORIZED, false, null, 'Unauthorized'), {
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  }

  try {
    const deleted = await deleteUserById(authUser.id);
    if (!deleted) {
      return NextResponse.json(new ApiResponse(HTTP_STATUS.NOT_FOUND, false, null, 'Account not found'), {
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    return NextResponse.json(new ApiResponse(HTTP_STATUS.OK, true, null, 'Account deleted successfully'), {
      status: HTTP_STATUS.OK,
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      new ApiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, false, null, 'Failed to delete account'),
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
