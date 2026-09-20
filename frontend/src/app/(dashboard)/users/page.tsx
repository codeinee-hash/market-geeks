import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/react-query'
import { getServerApi } from '@/lib/server-api'
import UsersClient from './users-client'
import { Header } from '@/components/layout/header'

export default async function UsersPage() {
  const queryClient = getQueryClient()
  const api = await getServerApi()

  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/admin/users').then((res) => res.data),
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Пользователи" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UsersClient />
      </HydrationBoundary>
    </div>
  )
}
