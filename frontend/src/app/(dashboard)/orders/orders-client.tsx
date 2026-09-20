'use client'

import Link from 'next/link'
import { Eye } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useQuery } from '@tanstack/react-query'

import { Order, OrderStatus } from '@/types'
import api from '@/lib/api'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export const statusMap: Record<OrderStatus, { label: string; color: "default" | "secondary" | "destructive" | "outline" | "secondary" }> = {
  pending: { label: 'Ожидает', color: 'outline' },
  processing: { label: 'В обработке', color: 'secondary' },
  shipped: { label: 'Отправлен', color: 'default' },
  delivered: { label: 'Доставлен', color: 'default' },
  cancelled: { label: 'Отменён', color: 'destructive' },
}

export default function OrdersClient() {
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => api.get('/admin/orders', { params: { limit: 50 } })
                      .then((res) => res.data.data || []),
  })

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Заказа</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-[32px]" /></TableCell>
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Нет заказов.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium text-muted-foreground text-xs">
                    {order._id.slice(-8)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{typeof order.user === 'object' ? order.user.login : 'Пользователь'}</span>
                      <span className="text-xs text-muted-foreground">{typeof order.user === 'object' ? order.user.email : ''}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm', { locale: ru })}
                  </TableCell>
                  <TableCell className="font-medium">
                    {order.totalPrice.toLocaleString('ru-RU')} ₽
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusMap[order.status]?.color || 'outline'}>
                      {statusMap[order.status]?.label || order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                      <Link href={`/orders/${order._id}`} prefetch={true}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
