import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={twMerge(clsx("animate-pulse bg-gray-300 rounded", className))} />
  )
}
