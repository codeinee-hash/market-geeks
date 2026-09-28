'use client'

import { useEffect, useState } from 'react'
import { User } from '@/types'
import { getProfile, logout } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile()
      .then((res) => {
        if (res.data?.role !== 'ADMIN') {
          logout().finally(() => {
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
              window.location.href = '/login'
            }
          })
          return
        }
        setUser(res.data)
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { user, loading }
}
