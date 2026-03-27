import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    const protectedRoutes = ['/dashboard', '/leaderboard', '/arena', '/profile'];
    const isProtectedRoute = protectedRoutes.some(path => req.nextUrl.pathname.startsWith(path));

    if (isProtectedRoute && !session) {
        const url = new URL('/login', req.url);
        url.searchParams.set('message', 'ACCESS RESTRICTED: LOGIN REQUIRED TO ACCESS THIS SECTOR');
        return NextResponse.redirect(url);
    }

    return res;
}

export const config = {
    matcher: ['/dashboard/:path*', '/leaderboard/:path*', '/arena/:path*', '/profile/:path*'],
};
