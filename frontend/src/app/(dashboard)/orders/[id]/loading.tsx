import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export default function OrderDetailsLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Заказ" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Верхняя панель: кнопка назад, номер заказа, статус */}
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-7 w-48 rounded-md" />
            <Skeleton className="h-4 w-36 rounded-md" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-9 w-[180px] rounded-md" />
          </div>
        </div>

        {/* Сетка: Товары (2/3) + Данные клиента (1/3) */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Товар</TableHead>
                      <TableHead className="text-center">Кол-во</TableHead>
                      <TableHead className="text-right">Цена</TableHead>
                      <TableHead className="text-right">Сумма</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded object-cover" />
                            <Skeleton className="h-4 w-[160px]" />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-4 w-6 mx-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-16 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-20 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Separator className="my-4" />

                <div className="flex justify-between items-center pt-1">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-28" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-44" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Skeleton className="h-3.5 w-16 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div>
                  <Skeleton className="h-3.5 w-16 mb-2" />
                  <Skeleton className="h-5 w-48" />
                </div>
                <Separator />
                <div>
                  <Skeleton className="h-3.5 w-28 mb-2" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
