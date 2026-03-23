'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = (message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts(prev => [...prev, { id, message, type }])
        
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 3000)
    }

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-0 right-0 z-[100] p-4 sm:p-6 space-y-3 pointer-events-none flex flex-col items-end w-full sm:max-w-md">
                {toasts.map(toast => {
                    const icons = {
                        success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
                        error: <AlertCircle className="w-5 h-5 text-red-500" />,
                        info: <Info className="w-5 h-5 text-blue-500" />
                    }
                    
                    return (
                        <div 
                            key={toast.id}
                            className="pointer-events-auto w-fit flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-lg border border-[#e8ddd0] animate-in slide-in-from-bottom-5 fade-in duration-300"
                        >
                            {icons[toast.type]}
                            <p className="text-sm font-semibold text-[#2E2E2E]">{toast.message}</p>
                            <button 
                                onClick={() => removeToast(toast.id)}
                                className="ml-2 text-gray-400 hover:text-[#2E2E2E] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )
                })}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) throw new Error('useToast must be used within ToastProvider')
    return context
}
