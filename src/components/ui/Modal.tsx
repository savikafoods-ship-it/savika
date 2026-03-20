'use client'

import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function Modal({ 
  isOpen, 
  onClose, 
  children, 
  className 
}: { 
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string 
}) {
  if (!isOpen) return null
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200" 
      onClick={onClose}
    >
      <div 
        className={twMerge(clsx("bg-white rounded-2xl p-6 shadow-xl max-w-md w-full animate-in zoom-in-95 duration-200", className))}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
