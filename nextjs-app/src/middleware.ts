import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie');
  console.log('🔹 [Middleware] Cookie Header:', cookieHeader);

  if (!cookieHeader) {
    console.log('❌ Không tìm thấy Cookie trên server!');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const accessToken = cookieHeader
    ?.split('; ')
    .find(c => c.startsWith('accessToken='))
    ?.split('=')[1];

  console.log('🔹 [Middleware] Extracted Access Token:', accessToken);

  if (!accessToken) {
    console.log('❌ Không tìm thấy accessToken trong cookie!');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const user: any = jwtDecode(accessToken);
    console.log('🔹 [Middleware] Decoded User:', user);

    if (!user?.role) {
      console.log('❌ Token không chứa thông tin role!');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/dashboard') && user.role !== 'admin') {
      console.log('❌ Người dùng không có quyền truy cập Dashboard!');
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('❌ Lỗi khi decode token:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard'],
};

