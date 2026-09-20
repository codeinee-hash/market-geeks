'use client'

import { Package, ShoppingCart, Tag, Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export default function DashboardClient() {
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then((res) => res.data.data || []),
  })

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data.data || []),
  })

  const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/admin/orders').then((res) => res.data.data || []),
  })

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/admin/users').then((res) => res.data.data || []),
  })

  const stats = [
    {
      title: 'Всего товаров',
      value: productsData?.length || 0,
      icon: Package,
      isLoading: isLoadingProducts,
      color: 'text-blue-500',
    },
    {
      title: 'Всего категорий',
      value: categoriesData?.length || 0,
      icon: Tag,
      isLoading: isLoadingCategories,
      color: 'text-orange-500'
    },
    {
      title: 'Всего заказов',
      value: ordersData?.length || 0,
      icon: ShoppingCart,
      isLoading: isLoadingOrders,
      color: 'text-green-500'
    },
    {
      title: 'Пользователи',
      value: usersData?.length || 0,
      icon: Users,
      isLoading: isLoadingUsers,
      color: 'text-teal-500'
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={cn(stat.color, 'h-4 w-4')} />
            </CardHeader>
            <CardContent>
              {stat.isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
