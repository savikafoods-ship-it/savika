import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={twMerge(
        clsx(
          "h-12 px-4 rounded-lg border border-gray-300 bg-white placeholder:text-gray-500 text-gray-950",
          "focus:outline-none focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700",
          className
        )
      )} 
      {...props} 
    />
  )
}
