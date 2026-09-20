import { use } from 'react'
import OrderDetailsClient from './order-details-client'
import { Header } from '@/components/layout/header'

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={`Заказ #${id.slice(-8)}`} />
      <OrderDetailsClient id={id} />
    </div>
  )
}
