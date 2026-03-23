import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite/server'
import { Query } from 'node-appwrite'

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const COL_ID = process.env.NEXT_PUBLIC_COL_SITE_CONTENT!

export async function GET() {
  try {
    const { databases } = await createAdminClient()
    const response = await databases.listDocuments(DB_ID, COL_ID, [
      Query.limit(25),
    ])
    const result: Record<string, unknown> = {}
    for (const doc of response.documents) {
      try {
        result[doc.$id] = typeof doc.value === 'string'
          ? JSON.parse(doc.value)
          : doc.value
      } catch {
        result[doc.$id] = doc.value
      }
    }
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch content'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { databases } = await createAdminClient()
    const body = await req.json()
    const { key, value } = body as { key: string; value: object }

    if (!key || !value) {
      return NextResponse.json({ error: 'Missing key or value' }, { status: 400 })
    }

    const allowedKeys = ['promo_card_1', 'promo_card_2', 'announcement_bar']
    if (!allowedKeys.includes(key)) {
      return NextResponse.json({ error: 'Invalid content key' }, { status: 400 })
    }

    const now = new Date().toISOString()
    try {
      await databases.updateDocument(DB_ID, COL_ID, key, {
        value: JSON.stringify(value),
        updatedAt: now,
      })
    } catch {
      await databases.createDocument(DB_ID, COL_ID, key, {
        value: JSON.stringify(value),
        updatedAt: now,
      })
    }

    return NextResponse.json({ success: true, key, updatedAt: now })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update content'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
