import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/react-query'
import { getServerApi } from '@/lib/server-api'
import CategoriesClient from './categories-client'
import { Header } from '@/components/layout/header'

export default async function CategoriesPage() {
  const queryClient = getQueryClient()
  const api = await getServerApi()

  await queryClient.prefetchQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data),
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Категории" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CategoriesClient />
      </HydrationBoundary>
    </div>
  )
}
