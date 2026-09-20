import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/react-query'
import { getServerApi } from '@/lib/server-api'
import ProductFormClient from './product-form'
import { Header } from '@/components/layout/header'

export default async function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === 'new'

  const queryClient = getQueryClient()
  const api = await getServerApi()

  // Загружаем категории для селекта в форме
  await queryClient.prefetchQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data),
  })

  // Если это редактирование, загружаем данные товара
  if (!isNew) {
    await queryClient.prefetchQuery({
      queryKey: ['product', id],
      queryFn: () => api.get(`/products/${id}`).then((res) => res.data),
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={isNew ? 'Новый товар' : 'Редактирование товара'} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductFormClient id={id} />
      </HydrationBoundary>
    </div>
  )
}
