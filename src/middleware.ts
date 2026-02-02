import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // LOGGING TO DEBUG
    console.log(`[Middleware] Checking request: ${request.nextUrl.pathname}`)

    const sessionCookie = request.cookies.get('session_provider_id')
    const { pathname } = request.nextUrl

    // Define public paths that don't need authentication
    // Note: /api/auth/* should be public if you have auth routes there
    const isPublicPath = pathname === '/login' || pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname === '/'

    // 1. Protected Route & No Session -> Redirect to Login
    if (!isPublicPath && !sessionCookie) {
        console.log(`[Middleware] No session for ${pathname} -> Redirecting to /login`)
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    // 2. Login Page & Has Session -> Redirect to Dashboard
    if (pathname === '/login' && sessionCookie) {
        console.log(`[Middleware] Session exists for ${pathname} -> Redirecting to /dashboard`)
        const dashboardUrl = new URL('/dashboard', request.url)
        return NextResponse.redirect(dashboardUrl)
    }

    // 3. Root path handling
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
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
