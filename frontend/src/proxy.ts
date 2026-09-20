import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl
	const accessToken = request.cookies.get('access_token')

	if (pathname.startsWith('/login')) {
		if (accessToken) {
			return NextResponse.redirect(new URL('/', request.url))
		}
		return NextResponse.next()
	}

	if (!accessToken) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
}
