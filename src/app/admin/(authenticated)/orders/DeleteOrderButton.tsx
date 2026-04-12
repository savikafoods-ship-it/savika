'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function DeleteOrderButton({ orderId }: { orderId: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to permanently delete this order? This action cannot be undone.')) {
            return
        }

        setIsDeleting(true)
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'DELETE',
            })
            if (!res.ok) throw new Error('Failed to delete order')
            
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Error deleting order. Please try again.')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <button 
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete Order"
            className="inline-flex items-center justify-center p-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <FontAwesomeIcon icon={isDeleting ? faSpinner : faTrash} className={isDeleting ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
        </button>
    )
}
