import { Client, Account, Databases, Storage, Users } from 'node-appwrite'
import { cookies } from 'next/headers'

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'dummy')
    .setKey(process.env.APPWRITE_API_KEY!)
  return {
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
    users: new Users(client),
  }
}

export async function createSessionClient() {
  const cookieStore = await cookies()
  const session = cookieStore.get('savika-session')
  if (!session || !session.value) throw new Error('No session')

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setSession(session.value)
  return {
    account: new Account(client),
    databases: new Databases(client),
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
