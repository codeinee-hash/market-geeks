import { User } from '@/types'
import api from './api'

export async function login(loginOrEmail: string, password: string) {
	const res = await api.post('/auth/sign-in', { loginOrEmail, password })

	// Устанавливаем access_token на домен фронтенда,
	// чтобы proxy мог проверить авторизацию при навигации
	if (res.data.accessToken) {
		document.cookie = `access_token=${res.data.accessToken}; path=/; max-age=${2 * 24 * 60 * 60}; SameSite=Lax`
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
