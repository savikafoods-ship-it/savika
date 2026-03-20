import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function Badge({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span 
      className={twMerge(
        clsx("inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-700 text-white", className)
      )} 
      {...props}
    >
      {children}
    </span>
  )
}
