import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function Button({ 
  className, 
  variant = 'primary', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  
  const base = "inline-flex items-center justify-center font-semibold text-sm sm:text-base rounded-lg transition-transform transition-colors"
  
  const variants = {
    primary: "h-12 px-6 bg-amber-700 text-white hover:bg-amber-800 active:scale-95 duration-150",
    secondary: "h-10 px-4 border border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white",
    ghost: "h-10 px-4 text-gray-700 hover:bg-stone-100"
  }

  return (
    <button className={twMerge(clsx(base, variants[variant], className))} {...props} />
  )
}
