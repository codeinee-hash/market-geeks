import DashboardClient from './dashboard-client'
import { Header } from '@/components/layout/header'

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Дашборд" />
      <DashboardClient />
    </div>
  )
}
