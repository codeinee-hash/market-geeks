import CategoriesClient from './categories-client'
import { Header } from '@/components/layout/header'

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Категории" />
      <CategoriesClient />
    </div>
  )
}
