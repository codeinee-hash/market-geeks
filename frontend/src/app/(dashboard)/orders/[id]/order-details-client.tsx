'use client'

import { useRouter } from 'next/navigation'
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
import { AxiosError } from 'axios'

export default function OrderDetailsClient({ id }: { id: string }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => api.get(`/admin/orders/${id}`).then(res => res.data.data),
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
    return <div className="p-8">Загрузка информации о заказе...</div>
  }

  const user = typeof order.user === 'object' ? order.user : null

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="outline" size="icon" onClick={() => router.push('/orders')}>
          <ArrowLeft className="h-4 w-4" />
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
