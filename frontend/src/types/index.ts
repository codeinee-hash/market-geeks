// ==================== User ====================
export interface User {
  _id: string
  login: string
  email: string
  role: 'USER' | 'ADMIN'
  createdAt?: string
  updatedAt?: string
}

// ==================== Category ====================
export interface Category {
  _id: string
  name: string
  description: string
  image: string
  createdAt?: string
  updatedAt?: string
}

// ==================== Product ====================
export interface Product {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string | { _id: string; name: string }
  stock: number
  createdAt?: string
  updatedAt?: string
}

// ==================== Cart ====================
export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  _id: string
  user: string
  items: CartItem[]
}

// ==================== Order ====================
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  product: Product | string
  quantity: number
  price: number
}

export interface Order {
  _id: string
  user: User | string
  items: OrderItem[]
  totalPrice: number
  status: OrderStatus
  deliveryAddress: string
  comment: string
  createdAt: string
  updatedAt?: string
}

// ==================== API Responses ====================
export interface ApiResponse<T> {
  status: string
  data: T
  message?: string
}

export interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

export interface PaginatedResponse<T> {
  status: string
  data: T[]
  pagination: Pagination
}
