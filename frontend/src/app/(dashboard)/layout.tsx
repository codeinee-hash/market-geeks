import { Suspense } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { BackgroundGrid } from '@/components/layout/background-grid'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      <BackgroundGrid />
      <Suspense fallback={<aside className="hidden md:flex h-full w-64 border-r bg-card/80 backdrop-blur-md" />}>
        <Sidebar className="relative z-10 hidden md:flex" />
      </Suspense>
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
