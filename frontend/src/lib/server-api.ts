import { cookies } from 'next/headers'

export async function getServerApi() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Cookie'] = `access_token=${token}`
  }

  return {
    get: async (url: string, init?: RequestInit) => {
      const res = await fetch(`${baseUrl}${url}`, {
        ...init,
        headers: {
          ...headers,
          ...init?.headers,
        },
      })
      if (!res.ok) {
        throw new Error(`Failed to fetch ${url}`)
      }
      return res.json()
    },
  }
}
