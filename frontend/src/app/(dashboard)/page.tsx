import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/react-query'
import { getServerApi } from '@/lib/server-api'
import DashboardClient from './dashboard-client'
import { Header } from '@/components/layout/header'

export default async function DashboardPage() {
  const queryClient = getQueryClient()
  const api = await getServerApi()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['products'],
      queryFn: () => api.get('/products').then((res) => res.data),
    }),
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: () => api.get('/categories').then((res) => res.data),
    }),
    queryClient.prefetchQuery({
      queryKey: ['orders'],
      queryFn: () => api.get('/admin/orders').then((res) => res.data),
    }),
    queryClient.prefetchQuery({
      queryKey: ['users'],
      queryFn: () => api.get('/admin/users').then((res) => res.data),
    }),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Дашборд" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardClient />
      </HydrationBoundary>
    </div>
  )
}
