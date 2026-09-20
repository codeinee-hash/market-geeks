'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

import api from '@/lib/api'
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
import { AxiosError } from 'axios'

export default function CategoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  
  const isNew = id === 'new'
  const [loading, setLoading] = useState(!isNew)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
    },
  })

  useEffect(() => {
    const fetchCategory = async () => {
      if (isNew) return;
      try {
        const { data } = await api.get(`/categories/${id}`)
        form.reset({
          name: data.data.name,
          description: data.data.description || '',
          image: data.data.image || '',
        })
      } catch (error) {
        console.error('Failed to fetch category:', error)
        toast.error('Категория не найдена')
        router.push('/categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [id, isNew, form, router])

  async function onSubmit(values: CategoryFormData) {
    setSubmitting(true)
    try {
      if (isNew) {
        await api.post('/admin/categories', values)
        toast.success('Категория успешно создана')
      } else {
        await api.patch(`/admin/categories/${id}`, values)
        toast.success('Категория обновлена')
      }
      router.push('/categories')
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Произошла ошибка')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="Загрузка..." />
        <div className="p-8">Загрузка данных категории...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={isNew ? 'Новая категория' : 'Редактирование категории'} />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/categories')}>
            <ArrowLeft className="h-4 w-4" />
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
                  <Button type="button" variant="outline" onClick={() => router.push('/categories')}>
                    Отмена
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Сохранение...' : 'Сохранить'}
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
