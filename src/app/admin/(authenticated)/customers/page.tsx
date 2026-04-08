'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faCircleUser, faSpinner, faBox, faIndianRupeeSign, faPhone, faEnvelope, faDownload } from '@fortawesome/free-solid-svg-icons'
import { formatCurrency } from '@/lib/utils'

interface CustomerSummary {
    email: string
    name: string
    mobile: string
    total_orders: number
    total_spent: number
    last_order_at: string
}

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<CustomerSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/admin/customers')
            if (res.ok) {
                const data = await res.json()
                setCustomers(data)
            }
        } catch (err) {
            console.error('Failed to fetch customers:', err)
        } finally {
            setLoading(false)
        }
    }

    const filtered = search
        ? customers.filter(c =>
            c.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.email?.toLowerCase().includes(search.toLowerCase()) ||
            c.mobile?.includes(search)
        )
        : customers

    const handleExportCSV = () => {
        const headers = ['Name', 'Email', 'Mobile', 'Total Orders', 'Total Spent', 'Last Order']
        const rows = filtered.map(c => [
            c.name, c.email, c.mobile, c.total_orders, c.total_spent, new Date(c.last_order_at).toLocaleDateString('en-IN')
        ])
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `savika-customers-${Date.now()}.csv`
        a.click()
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 animate-spin text-amber-600" />
        </div>
    )

    return (
        <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Customers</h1>
                    <p className="text-[#a1a1aa] text-xs sm:text-sm mt-1">{customers.length} unique customers from placed orders.</p>
                </div>
                <button 
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap"
                >
                    <FontAwesomeIcon icon={faDownload} className="w-3.5 h-3.5" /> Export CSV
                </button>
            </div>

            <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-[#27272a]">
                    <div className="relative w-full sm:w-96">
                        <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Search by name, email or phone..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-[#27272a] border-none text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:ring-1 focus:ring-[#C17F24] outline-none"
                        />
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#27272a]/50 text-[#a1a1aa]">
                            <tr>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Phone</th>
                                <th className="px-6 py-4 font-medium">Orders</th>
                                <th className="px-6 py-4 font-medium">Total Spent</th>
                                <th className="px-6 py-4 font-medium">Last Order</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#27272a]">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[#a1a1aa]">No customers found.</td>
                                </tr>
                            ) : filtered.map((customer) => (
                                <tr key={customer.email} className="hover:bg-[#27272a]/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#27272a] flex items-center justify-center shrink-0">
                                                <FontAwesomeIcon icon={faCircleUser} className="w-5 h-5 text-[#a1a1aa]" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{customer.name || 'Guest'}</div>
                                                <div className="text-xs text-[#a1a1aa]">{customer.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[#e4e4e7]">{customer.mobile || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500">
                                            {customer.total_orders}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-white font-bold">{formatCurrency(customer.total_spent)}</td>
                                    <td className="px-6 py-4 text-[#a1a1aa]">
                                        {new Date(customer.last_order_at).toLocaleDateString('en-IN')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-[#27272a]">
                    {filtered.length === 0 ? (
                        <p className="px-4 py-12 text-center text-[#a1a1aa] text-sm">No customers found.</p>
                    ) : filtered.map((customer) => (
                        <div key={customer.email} className="p-4 space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#27272a] flex items-center justify-center shrink-0">
                                    <FontAwesomeIcon icon={faCircleUser} className="w-5 h-5 text-[#a1a1aa]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-white truncate">{customer.name || 'Guest'}</p>
                                    <p className="text-xs text-[#a1a1aa] truncate flex items-center gap-1">
                                        <FontAwesomeIcon icon={faEnvelope} className="w-2.5 h-2.5" /> {customer.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                                <span className="text-[#a1a1aa] flex items-center gap-1">
                                    <FontAwesomeIcon icon={faPhone} className="w-2.5 h-2.5" /> {customer.mobile || '-'}
                                </span>
                                <span className="text-amber-500 font-bold flex items-center gap-1">
                                    <FontAwesomeIcon icon={faBox} className="w-2.5 h-2.5" /> {customer.total_orders} orders
                                </span>
                                <span className="text-white font-bold flex items-center gap-1">
                                    <FontAwesomeIcon icon={faIndianRupeeSign} className="w-2.5 h-2.5" /> {formatCurrency(customer.total_spent)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
