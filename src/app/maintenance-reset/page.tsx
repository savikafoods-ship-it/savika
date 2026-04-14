'use client'

import { useState } from 'react'

export default function TriggerResetPage() {
    const [status, setStatus] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const handleReset = async () => {
        if (!confirm('STRICT WARNING: This will PERMANENTLY delete all orders, reviews, coupons, and non-admin customers. Proceed?')) return
        
        setLoading(true)
        try {
            const res = await fetch('/api/admin/maintenance/reset-db', {
                method: 'POST',
                headers: {
                    'x-maintenance-key': 'SAVIKA_RESET_2024_CONFIRM'
                }
            })
            const data = await res.json()
            setStatus(data)
        } catch (err: any) {
            setStatus({ error: err.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-20 font-sans">
            <h1 className="text-2xl font-bold mb-4">Database Reset Trigger</h1>
            <p className="mb-8 text-red-500 font-bold uppercase">Dangerous Action Area</p>
            
            <button 
                onClick={handleReset}
                disabled={loading}
                className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50"
            >
                {loading ? 'RESETTING...' : 'CORE RESET: WIPE TRANS DATA'}
            </button>

            {status && (
                <pre className="mt-8 p-4 bg-gray-100 rounded-lg overflow-auto">
                    {JSON.stringify(status, null, 2)}
                </pre>
            )}
        </div>
    )
}
