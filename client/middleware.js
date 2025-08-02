import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  const protectedPaths = ['/account', '/admin', '/wishlist'];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // Block access if not authenticated
  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Block access to admin routes if not admin
  if (token && pathname.startsWith('/admin')) {
    if (!token.isAdmin)
    return NextResponse.redirect(new URL('/', request.url)); // or /unauthorized
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/admin/:path*', '/wishlist/:path*'],
};
