import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

function parseJwtPayload(token: string): { role?: string; exp?: number } | null {
	try {
		const parts = token.split('.')
		if (parts.length < 2) return null
		const base64Url = parts[1]
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		let json = ''
		if (typeof Buffer !== 'undefined') {
			json = Buffer.from(base64, 'base64').toString('utf8')
		} else {
			json = decodeURIComponent(
				atob(base64)
					.split('')
					.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
					.join('')
			)
		}
		return JSON.parse(json)
	} catch {
		return null
	}
}

function isValidAdminToken(token?: string): boolean {
	if (!token) return false
	const payload = parseJwtPayload(token)
	if (!payload) return false
	if (payload.role !== 'ADMIN') return false
	if (payload.exp && payload.exp * 1000 < Date.now()) return false
	return true
}

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl
	const accessToken = request.cookies.get('access_token')?.value
	const hasValidAdmin = isValidAdminToken(accessToken)

	if (pathname.startsWith('/login')) {
		if (hasValidAdmin) {
			return NextResponse.redirect(new URL('/', request.url))
		}
		return NextResponse.next()
	}

	if (!hasValidAdmin) {
		const response = NextResponse.redirect(new URL('/login', request.url))
		if (accessToken) {
			response.cookies.delete('access_token')
		}
		return response
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

