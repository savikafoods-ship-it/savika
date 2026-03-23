// Savika Foods - Appwrite Collection Types

// Profile (collection: profiles)
export interface Profile {
  $id: string
  userId: string
  fullName: string
  email: string
  mobile?: string
  address?: string // JSON: {street, city, state, pincode}
  avatarUrl?: string
  wishlistIds?: string[]
  createdAt: string
}

// Product (collection: products)
export interface Product {
  $id: string
  name: string
  slug: string
  description?: string
  price: number
  comparePrice?: number
  stock: number
  categoryId?: string
  category?: Category
  imageIds?: string[]
  isActive: boolean
  tags?: string[]
  $createdAt?: string
  $updatedAt?: string
}

// Category (collection: categories)
export interface Category {
  $id: string
  name: string
  slug: string
  imageId?: string
  sortOrder?: number
  $createdAt?: string
  $updatedAt?: string
}

// Order status & payment
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

// Order (collection: orders)
export interface Order {
  $id: string
  userId: string
  items: string // JSON array of cart items
  subtotal: number
  discount: number
  total: number
  couponCode?: string
  status: OrderStatus
  phonePeMerchantOrderId?: string
  phonePeTransactionId?: string
  shippingAddress: string // JSON delivery address
  createdAt: string
  // Hydrated fields (not stored in Appwrite)
  parsedItems?: OrderItem[]
  parsedAddress?: ShippingAddress
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
