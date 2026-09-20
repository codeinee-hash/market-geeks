import { Header } from '@/components/layout/header'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function CategoriesLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Категории" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Заголовок и кнопка создания */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-44 rounded-md" />
          <Skeleton className="h-9 w-48 rounded-md" />
        </div>

        {/* Сетка карточек категорий */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video w-full">
                <Skeleton className="h-full w-full rounded-none" />
              </div>
              <CardHeader>
                <Skeleton className="h-5 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardFooter className="flex gap-2">
                <Skeleton className="h-8 flex-1 rounded-md" />
                <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
