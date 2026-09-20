'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { Category } from '@/types'
import api from '@/lib/api'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function CategoriesClient() {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Загрузка категорий через React Query (использует гидрированные данные из SSR)
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data.data || []),
  })

  // Удаление категории
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/categories/${id}`),
    onSuccess: () => {
      toast.success('Категория успешно удалена')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setDeleteId(null)
    },
    onError: () => {
      toast.error('Не удалось удалить категорию')
      setDeleteId(null)
    },
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Все категории</h2>
        <Button onClick={() => router.push('/categories/new')}>
          <Plus className="mr-2 h-4 w-4" /> Добавить категорию
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <CardHeader>
                <Skeleton className="h-5 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : categories.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            Нет категорий
          </div>
        ) : (
          categories.map((category) => (
            <Card key={category._id} className="overflow-hidden">
              {category.image ? (
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-secondary flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Нет изображения</span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {category.description || 'Нет описания'}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1" size="sm" onClick={() => router.push(`/categories/${category._id}`)}>
                  <Pencil className="mr-2 h-3 w-3" /> Изменить
                </Button>
                <Button variant="destructive" size="icon" className="h-8 w-8 shrink-0" onClick={() => setDeleteId(category._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удаление категории</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите безвозвратно удалить эту категорию? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={deleteMutation.isPending}>Отмена</Button>
            </DialogClose>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Удаление...' : 'Удалить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
