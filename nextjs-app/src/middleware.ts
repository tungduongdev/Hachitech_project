import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie');
  const accessToken = cookieHeader
    ?.split('; ')
    .find(c => c.startsWith('accessToken='))
    ?.split('=')[1];

  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const user: any = jwtDecode(accessToken);
    const userRole = user?.role;

    //console.log('User Role:', userRole);

    if (req.nextUrl.pathname.startsWith('/dashboard') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Invalid token:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard'],
};
