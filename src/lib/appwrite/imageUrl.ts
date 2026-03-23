export function getProductImageUrl(
  fileId: string,
  width = 400,
  quality = 80
): string {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  const bucket = process.env.NEXT_PUBLIC_BUCKET_PRODUCTS
  return (
    `${endpoint}/storage/buckets/${bucket}/files/${fileId}/preview` +
    `?project=${projectId}&width=${width}&quality=${quality}&output=webp`
  )
}

export function getSiteImageUrl(fileId: string, width = 800): string {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  const bucket = process.env.NEXT_PUBLIC_BUCKET_SITE
  return (
    `${endpoint}/storage/buckets/${bucket}/files/${fileId}/preview` +
    `?project=${projectId}&width=${width}&quality=85&output=webp`
  )
}

export function getAvatarUrl(fileId: string): string {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  const bucket = process.env.NEXT_PUBLIC_BUCKET_AVATARS
  return (
    `${endpoint}/storage/buckets/${bucket}/files/${fileId}/preview` +
    `?project=${projectId}&width=100&quality=80&output=webp`
  )
}
