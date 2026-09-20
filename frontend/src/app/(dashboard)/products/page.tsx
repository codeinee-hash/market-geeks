import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/react-query'
import { getServerApi } from '@/lib/server-api'
import ProductsClient from './products-client'
import { Header } from '@/components/layout/header'

export default async function ProductsPage() {
  const queryClient = getQueryClient()
  const api = await getServerApi()

  await queryClient.prefetchQuery({
    queryKey: ['products', ''], // пустой search по умолчанию
    queryFn: () => api.get('/products?limit=50').then((res) => res.data),
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Товары" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductsClient />
      </HydrationBoundary>
    </div>
  )
}
