import { use } from 'react'
import ProductFormClient from './product-form'
import { Header } from '@/components/layout/header'

export default function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const isNew = id === 'new'

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={isNew ? 'Новый товар' : 'Редактирование товара'} />
      <ProductFormClient id={id} />
    </div>
  )
}
