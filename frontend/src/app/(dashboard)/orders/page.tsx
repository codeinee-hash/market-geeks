import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/react-query'
import { getServerApi } from '@/lib/server-api'
import OrdersClient from './orders-client'
import { Header } from '@/components/layout/header'

export default async function OrdersPage() {
  const queryClient = getQueryClient()
  const api = await getServerApi()

  await queryClient.prefetchQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/admin/orders?limit=50').then((res) => res.data),
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Заказы" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <OrdersClient />
      </HydrationBoundary>
    </div>
  )
}
