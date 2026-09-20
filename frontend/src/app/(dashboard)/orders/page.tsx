import OrdersClient from './orders-client'
import { Header } from '@/components/layout/header'

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Заказы" />
      <OrdersClient />
    </div>
  )
}
