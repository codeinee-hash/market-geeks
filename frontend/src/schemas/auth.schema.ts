import { z } from 'zod'

export const loginSchema = z.object({
  loginOrEmail: z.string().min(1, 'Введите логин или email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

export type LoginFormData = z.infer<typeof loginSchema>
