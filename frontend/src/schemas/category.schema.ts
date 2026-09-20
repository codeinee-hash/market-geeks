import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'Введите название категории'),
  description: z.string(),
  image: z.string(),
})

export type CategoryFormData = z.infer<typeof categorySchema>
