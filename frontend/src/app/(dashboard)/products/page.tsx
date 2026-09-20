import ProductsClient from './products-client'
import { Header } from '@/components/layout/header'

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Товары" />
      <ProductsClient />
    </div>
  )
}
