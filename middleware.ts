import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;
  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/');
  const isLoginPath = pathname === '/admin/login' || pathname.startsWith('/admin/login');

  // If not visiting admin routes, pass through immediately
  if (!isAdminPath) {
    return supabaseResponse;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Fallback: If Supabase is not configured -> enforce local_admin_session cookie
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl === 'https://placeholder.supabase.co'
  ) {
    const localSession = request.cookies.get('local_admin_session')?.value;
    if (!isLoginPath && !localSession) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    if (isLoginPath && localSession) {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }
    return supabaseResponse;
  }

  // Supabase SSR Client
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Verify authenticated user from session cookie
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If unauthenticated and trying to access admin dashboard -> Force redirect to /admin/login
  if (!isLoginPath && !user) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and visiting login page -> Redirect directly to /admin
  if (isLoginPath && user) {
    const adminUrl = new URL('/admin', request.url);
    return NextResponse.redirect(adminUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
  ],
};
