'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCsv, faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function ExportCSVButton() {
    const [exporting, setExporting] = useState(false)

    const handleExport = async () => {
        setExporting(true)
        try {
            const res = await fetch('/api/export/customers')
            if (!res.ok) {
                const msg = await res.text()
                throw new Error(msg || 'Export failed')
            }
            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            const today = new Date().toISOString().slice(0, 10)
            a.href = url
            a.download = `savika-customers-${today}.csv`
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        } catch (err: any) {
            alert(`Export failed: ${err.message}`)
        } finally {
            setExporting(false)
        }
    }

    return (
        <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
            <FontAwesomeIcon icon={exporting ? faSpinner : faFileCsv} className={`w-4 h-4 ${exporting ? 'animate-spin' : ''}`} />
            {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
    )
}
