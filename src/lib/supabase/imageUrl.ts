export function getProductImageUrl(path: string | null) {
  if (!path) return '/placeholder-product.png'
  
  // Assuming 'products' is the bucket name
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/products/${path}`
}
