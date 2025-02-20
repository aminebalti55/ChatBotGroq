import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ['/login', '/signup'];

  const isPublicRoute = publicRoutes.includes(pathname);

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/signup'],
};