import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Введите название товара'),
  description: z.string(),
  price: z.number().min(0, 'Цена не может быть отрицательной'),
  image: z.string(),
  category: z.string().min(1, 'Выберите категорию'),
  stock: z.number().min(0, 'Количество не может быть отрицательным'),
})

export type ProductFormData = z.infer<typeof productSchema>
