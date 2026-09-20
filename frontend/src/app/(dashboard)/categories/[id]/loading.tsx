import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function CategoryEditLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Категория" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Кнопка назад и заголовок */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-8 w-60 rounded-md" />
        </div>

        {/* Форма категории */}
        <Card className="max-w-2xl">
          <CardHeader>
            <Skeleton className="h-6 w-52" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Поле: Название */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Поле: URL изображения */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-32 w-48 rounded-md" />
            </div>

            {/* Поле: Описание */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>

            {/* Кнопки действий */}
            <div className="flex justify-end gap-4 pt-2">
              <Skeleton className="h-10 w-24 rounded-md" />
              <Skeleton className="h-10 w-28 rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
