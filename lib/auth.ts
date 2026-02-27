import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function getAuthUser(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) return null;
  return {
    ...token,
    id: token.id as string,
  };
}
