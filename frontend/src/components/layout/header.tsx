'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { useAuth } from '@/hooks/use-auth'
import { Menu } from 'lucide-react'
import { Sidebar } from './sidebar'
import { ThemeToggle } from './theme-toggle'

interface HeaderProps {
	title: string
}

export function Header({ title }: HeaderProps) {
	const { user } = useAuth()

	return (
		<header className='sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6'>
			<div className='flex items-center gap-3'>
				{/* Мобильное меню */}
				<Sheet>
					<SheetTrigger asChild>
						<Button variant='outline' size='icon' className='md:hidden'>
							<Menu className='h-5 w-5' />
						</Button>
					</SheetTrigger>
					<SheetContent side='left' className='w-64 p-0'>
						<SheetHeader className='sr-only'>
							<SheetTitle>Навигационное меню</SheetTitle>
						</SheetHeader>
						<Sidebar />
					</SheetContent>
				</Sheet>

				<h2 className='text-xl font-semibold tracking-tight'>{title}</h2>
			</div>

			<div className='flex items-center gap-3'>
				<ThemeToggle />
				{user && (
					<div className='hidden items-center gap-2 md:flex'>
						<span className='text-sm text-muted-foreground'>{user.login}</span>
						<Badge variant='secondary' className='text-xs'>
							{user.role}
						</Badge>
					</div>
				)}
			</div>
		</header>
	)
}
