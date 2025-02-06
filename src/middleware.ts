import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/auth';

export async function middleware(request: NextRequest) {
  const session = await getSession();

  // Agar user logged-in nahi hai aur login page ke alawa kisi bhi route pe ja raha hai,
  // to use /login pe redirect karo.
  if (!session && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Agar user logged-in hai aur /login route access kar raha hai,
  // to use /dashboard pe redirect karo.
  if (session && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Naya condition: Agar user logged-in hai aur root route "/" ya kisi bhi / se shuru hone wale route pe ja raha hai,
  // to use /dashboard pe redirect karo.
  if (session && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
