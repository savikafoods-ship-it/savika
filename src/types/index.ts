// Savika Foods - Database Types

// Profile (collection: profiles)
export interface Profile {
  id: string
  full_name: string
  email: string
  phone?: string
  address?: any // JSON: {street, city, state, pincode}
  avatar_url?: string
  wishlist_ids?: string[]
  is_active: boolean
  created_at: string
}

// Product (collection: products)
export interface Product {
  id: string
  name: string
  tagline?: string
  local_name?: string
  slug: string
  description?: string
  price: number
  compare_price?: number
  stock: number
  category_id?: string
  category?: Category
  image_urls?: string[]
  weight_options?: any[]
  metadata?: any
  rating?: number
  review_count?: number
  is_active: boolean
  tags?: string[]
  created_at?: string
  updated_at?: string
}

// Category (collection: categories)
export interface Category {
  id: string
  name: string
  slug: string
  image_url?: string
  sort_order?: number
  created_at?: string
  updated_at?: string
}

// Order status & payment
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

// Order (collection: orders)
export interface Order {
  id: string
  user_id: string
  items: any[] // Array of items
  subtotal: number
  discount: number
  total: number
  coupon_code?: string
  status: OrderStatus
  payment_status: 'pending' | 'paid' | 'failed'
  payment_id?: string
  shipping_address: any // JSON delivery address
  customer_name?: string
  customer_email?: string
  created_at: string
  updated_at?: string
}

// Parsed order item (from JSON)
export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  weight?: string
  imageId?: string
}

// Shipping address shape
export interface ShippingAddress {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
}

// Coupon (collection: coupons)
export interface Coupon {
  $id: string
  code: string
  discountPercent?: number
  discountFlat?: number
  minOrderValue: number
  isActive: boolean
  expiresAt?: string
}

// Site Content (collection: site_content)
export interface SiteContent {
  $id: string // key e.g. promo_card_1
  value: string // JSON string
  updatedAt: string
}

// Review (collection: reviews)
export interface Review {
  $id: string
  productId: string
  userId: string
  userName: string
  rating: number // 1-5
  comment?: string
  isVerifiedBuyer: boolean
  createdAt: string
}

// Cart (client-side, Zustand store)
export interface CartItem {
  productId: string
  product: Product
  quantity: number
  weight?: string
}
