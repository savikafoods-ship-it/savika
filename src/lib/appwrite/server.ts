// lib/appwrite/server.ts — Server-side Appwrite client (API routes only)
// NEVER import this file in client components
import { Client, Databases, Storage, Users } from 'node-appwrite'

export function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!)

  return {
    databases: new Databases(client),
    storage: new Storage(client),
    users: new Users(client),
  }
}

export async function createSessionClient() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(`a-session-${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`)
  
  if (!sessionCookie || !sessionCookie.value) {
    throw new Error('No session cookie found')
  }

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setSession(sessionCookie.value)

  return {
    account: new (await import('node-appwrite')).Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
  }
}

// Collection and bucket IDs — centralised for easy reference
export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
export const COL_PROFILES = process.env.NEXT_PUBLIC_COL_PROFILES!
export const COL_PRODUCTS = process.env.NEXT_PUBLIC_COL_PRODUCTS!
export const COL_CATEGORIES = process.env.NEXT_PUBLIC_COL_CATEGORIES!
export const COL_ORDERS = process.env.NEXT_PUBLIC_COL_ORDERS!
export const COL_COUPONS = process.env.NEXT_PUBLIC_COL_COUPONS!
export const COL_SITE_CONTENT = process.env.NEXT_PUBLIC_COL_SITE_CONTENT!
export const COL_REVIEWS = process.env.NEXT_PUBLIC_COL_REVIEWS!
export const BUCKET_PRODUCTS = process.env.NEXT_PUBLIC_BUCKET_PRODUCTS!
export const BUCKET_SITE = process.env.NEXT_PUBLIC_BUCKET_SITE!
export const BUCKET_AVATARS = process.env.NEXT_PUBLIC_BUCKET_AVATARS!
