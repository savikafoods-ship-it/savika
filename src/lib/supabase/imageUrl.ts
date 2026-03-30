export function getProductImageUrl(path: string | null | undefined) {
  if (!path) return '/placeholder-product.png'
  if (path.startsWith('http')) return path
  if (path.startsWith('/images/')) return path // Local public images
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return '/placeholder-product.png'

  // Clean the path: remove any leading slash 
  const cleanPath = path.startsWith('/') ? path.substring(1) : path
  
  // If the path already includes 'products/', we don't want to double it
  const finalPath = cleanPath.startsWith('products/') ? cleanPath : `products/${cleanPath}`
  
  // Note: 'products' is the bucket name
  return `${supabaseUrl}/storage/v1/object/public/${finalPath}`
}
