import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session_provider_id')
    const { pathname } = request.nextUrl

    // Define public paths that don't need authentication
    const isPublicPath = pathname === '/login' || pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname === '/'

    // 1. If trying to access a protected route (not public) and no session -> Redirect to Login
    if (!isPublicPath && !sessionCookie) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    // 2. If trying to access Login page but ALREADY has session -> Redirect to Dashboard
    if (pathname === '/login' && sessionCookie) {
        const dashboardUrl = new URL('/dashboard', request.url)
        return NextResponse.redirect(dashboardUrl)
    }

    // 3. Root path handling: Redirect root to login if no session, or dashboard if session exists
    if (pathname === '/') {
        if (sessionCookie) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        } else {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files with specific extensions (svg, png, jpg, jpeg, gif, webp)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
