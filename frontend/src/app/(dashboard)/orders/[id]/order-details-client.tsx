'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import type { Order } from '@/types'
import api from '@/lib/api'
import { statusMap } from '../orders-client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { AxiosError } from 'axios'

export default function OrderDetailsClient({ id }: { id: string }) {
  const queryClient = useQueryClient()

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => api.get(`/admin/orders/${id}`).then(res => res.data.data),
    initialData: () => {
      const orders = queryClient.getQueryData<Order[]>(['orders'])
      return orders?.find((o) => o._id === id)
    },
  })

  const statusMutation = useMutation({
    mutationFn: (newStatus: string) => api.patch(`/admin/orders/${id}/status`, { status: newStatus }),
    onSuccess: () => {
      toast.success('Статус заказа обновлён')
      queryClient.invalidateQueries({ queryKey: ['order', id] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Ошибка обновления статуса')
      }
    }
  })

  if (isLoading || !order) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-7 w-48 rounded-md" />
            <Skeleton className="h-4 w-36 rounded-md" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-9 w-[180px] rounded-md" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Товар</TableHead>
                      <TableHead className="text-center">Кол-во</TableHead>
                      <TableHead className="text-right">Цена</TableHead>
                      <TableHead className="text-right">Сумма</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded object-cover" />
                            <Skeleton className="h-4 w-[160px]" />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-4 w-6 mx-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-16 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-20 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Separator className="my-4" />

                <div className="flex justify-between items-center pt-1">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-28" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-44" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Skeleton className="h-3.5 w-16 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div>
                  <Skeleton className="h-3.5 w-16 mb-2" />
                  <Skeleton className="h-5 w-48" />
                </div>
                <Separator />
                <div>
                  <Skeleton className="h-3.5 w-28 mb-2" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const user = typeof order.user === 'object' ? order.user : null

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4 mb-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/orders" prefetch={true}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-tight">
            Заказ #{order._id.slice(-8)}
          </h2>
          <p className="text-sm text-muted-foreground">
            от {format(new Date(order.createdAt), 'dd MMMM yyyy, HH:mm', { locale: ru })}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm font-medium">Статус:</span>
          <Select 
            value={order.status} 
            onValueChange={(val) => statusMutation.mutate(val)}
            disabled={statusMutation.isPending}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите статус" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusMap).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Товары в заказе</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Товар</TableHead>
                    <TableHead className="text-center">Кол-во</TableHead>
                    <TableHead className="text-right">Цена</TableHead>
                    <TableHead className="text-right">Сумма</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => {
                    const product = typeof item.product === 'object' ? item.product : null
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {product?.image && (
                              <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover" />
                            )}
                            <span className="font-medium">{product?.name || 'Удалённый товар'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.price.toLocaleString('ru-RU')} ₽</TableCell>
                        <TableCell className="text-right font-medium">
                          {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Итого к оплате:</span>
                <span>{order.totalPrice.toLocaleString('ru-RU')} ₽</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Информация о клиенте</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Логин</div>
                <div className="font-medium">{user?.login || 'Неизвестно'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{user?.email || 'Неизвестно'}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">Адрес доставки</div>
                <div className="font-medium leading-tight mt-1">{order.deliveryAddress}</div>
              </div>
              {order.comment && (
                <div>
                  <div className="text-sm text-muted-foreground">Комментарий к заказу</div>
                  <div className="font-medium bg-muted p-2 rounded-md mt-1 text-sm">
                    {order.comment}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
