'use client'

import { useEffect, useRef } from 'react'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/lib/supabase/client'

export default function CartSync() {
    const { items, setItems } = useCartStore()
    const supabase = createClient()
    const initialFetchDone = useRef(false)
    const lastSyncedItems = useRef(JSON.stringify(items))

    // 1. Initial Fetch on Mount/Login
    useEffect(() => {
        const fetchCart = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            try {
                const res = await fetch('/api/cart/sync')
                if (res.ok) {
                    const data = await res.json()
                    if (data.items && data.items.length > 0) {
                        setItems(data.items)
                        lastSyncedItems.current = JSON.stringify(data.items)
                    }
                }
            } catch (error) {
                console.error('Failed to fetch cart:', error)
            } finally {
                initialFetchDone.current = true
            }
        }

        fetchCart()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
                fetchCart()
            } else if (event === 'SIGNED_OUT') {
                // Optional: Clear cart on logout? 
                // Decided: Keep local cart for guest experience, but stop syncing.
            }
        })

        return () => subscription.unsubscribe()
    }, [setItems, supabase.auth])

    // 2. Sync to DB on Changes
    useEffect(() => {
        const syncCart = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const currentItemsStr = JSON.stringify(items)
            if (currentItemsStr === lastSyncedItems.current) return

            try {
                const res = await fetch('/api/cart/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items }),
                })
                if (res.ok) {
                    lastSyncedItems.current = currentItemsStr
                }
            } catch (error) {
                console.error('Failed to sync cart:', error)
            }
        }

        // Debounce sync slightly to avoid excessive API calls
        const timer = setTimeout(() => {
            if (initialFetchDone.current) {
                syncCart()
            }
        }, 2000)

        return () => clearTimeout(timer)
    }, [items, supabase.auth])

    return null
}
