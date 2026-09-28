import { User } from '@/types'
import api from './api'

function parseJwtRole(token: string): string | null {
	try {
		const parts = token.split('.')
		if (parts.length < 2) return null
		const base64Url = parts[1]
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		)
		return JSON.parse(jsonPayload)?.role || null
	} catch {
		return null
	}
}

export async function login(loginOrEmail: string, password: string) {
	const res = await api.post('/auth/sign-in', {
		loginOrEmail,
		password,
		adminOnly: true,
	})

	const token = res.data?.accessToken
	const role = res.data?.user?.role || (token ? parseJwtRole(token) : null)

	if (role !== 'ADMIN') {
		await logout().catch(() => {})
		document.cookie = 'access_token=; path=/; max-age=0'
		throw new Error('Неверный логин или пароль')
	}

	// Устанавливаем access_token на домен фронтенда,
	// чтобы proxy мог проверить авторизацию при навигации
	if (token) {
		document.cookie = `access_token=${token}; path=/; max-age=${2 * 24 * 60 * 60}; SameSite=Lax`
	}

	return res.data
}

export async function logout() {
	const res = await api.post('/auth/logout')

	// Удаляем access_token с домена фронтенда
	document.cookie = 'access_token=; path=/; max-age=0'

	return res.data
}

export async function getProfile(): Promise<{ status: string; data: User }> {
	const res = await api.get('/auth/profile')
	return res.data
}

export async function refreshToken() {
	const res = await api.post('/auth/refresh')
	return res.data
}
