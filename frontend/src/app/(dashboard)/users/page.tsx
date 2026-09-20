import UsersClient from './users-client'
import { Header } from '@/components/layout/header'

export default function UsersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Пользователи" />
      <UsersClient />
    </div>
  )
}
