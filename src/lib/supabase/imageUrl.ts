export function getProductImageUrl(path: string | null) {
  if (!path) return '/placeholder-product.png'
  if (path.startsWith('http')) return path
  if (path.startsWith('/images/')) return path // Local public images
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const cleanPath = path.startsWith('/') ? path.substring(1) : path
  return `${supabaseUrl}/storage/v1/object/public/products/${cleanPath}`
}
