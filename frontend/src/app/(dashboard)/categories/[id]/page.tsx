'use client'

import { useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import api from '@/lib/api'
import { Category } from '@/types'
import { categorySchema, CategoryFormData } from '@/schemas/category.schema'
import { Header } from '@/components/layout/header'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AxiosError } from 'axios'

export default function CategoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { id } = use(params)
  
  const isNew = id === 'new'

  // Загружаем категорию с переиспользованием кэша из списка категорий
  const { data: categoryData, isLoading: isLoadingCategory } = useQuery<Category>({
    queryKey: ['category', id],
    queryFn: () => api.get(`/categories/${id}`).then((res) => res.data.data),
    enabled: !isNew,
    initialData: () => {
      const categories = queryClient.getQueryData<Category[]>(['categories'])
      return categories?.find((c) => c._id === id)
    },
  })

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
    },
  })

  useEffect(() => {
    if (categoryData) {
      form.reset({
        name: categoryData.name,
        description: categoryData.description || '',
        image: categoryData.image || '',
      })
    }
  }, [categoryData, form])

  const saveMutation = useMutation({
    mutationFn: (values: CategoryFormData) => {
      if (isNew) {
        return api.post('/admin/categories', values)
      } else {
        return api.patch(`/admin/categories/${id}`, values)
      }
    },
    onSuccess: () => {
      toast.success(isNew ? 'Категория успешно создана' : 'Категория обновлена')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category', id] })
      router.push('/categories')
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Произошла ошибка')
      }
    },
  })

  function onSubmit(values: CategoryFormData) {
    saveMutation.mutate(values)
  }

  const loading = !isNew && isLoadingCategory && !categoryData

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="Категория" />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-8 w-60 rounded-md" />
          </div>
          <Card className="max-w-2xl">
            <CardHeader>
              <Skeleton className="h-6 w-52" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-32 w-48 rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={isNew ? 'Новая категория' : 'Редактирование категории'} />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/categories" prefetch={true}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">
            {isNew ? 'Создание категории' : 'Редактирование категории'}
          </h2>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Информация о категории</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название</FormLabel>
                      <FormControl>
                        <Input placeholder="Смартфоны" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL изображения</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      {field.value && (
                        <div className="mt-2 h-32 w-48 overflow-hidden rounded-md border">
                          <img src={field.value} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Краткое описание категории..." className="resize-none" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button asChild type="button" variant="outline">
                    <Link href="/categories" prefetch={true}>
                      Отмена
                    </Link>
                  </Button>
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
