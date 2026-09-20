import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/react-query'
import { getServerApi } from '@/lib/server-api'
import OrderDetailsClient from './order-details-client'
import { Header } from '@/components/layout/header'

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const queryClient = getQueryClient()
  const api = await getServerApi()

  await queryClient.prefetchQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/admin/orders/${id}`).then((res) => res.data),
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={`Заказ #${id.slice(-8)}`} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <OrderDetailsClient id={id} />
      </HydrationBoundary>
    </div>
  )
}
