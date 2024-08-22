import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (token || pathname.includes('/api/auth')) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/api/auth/signin', req.url));
}

export const config = {
  matcher: [
    '/api/:path*', // Apply the middleware to all API routes
  ],
};
