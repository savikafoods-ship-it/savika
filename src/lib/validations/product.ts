import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with hyphens'),
  tagline: z.string().optional(),
  local_name: z.string().optional(),
  price: z.coerce.number().positive('Price must be a positive number'),
  compare_price: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().nonnegative('Stock cannot be negative'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  category_id: z.string().uuid('Invalid category ID').optional().nullable(),
  image_urls: z.array(z.string()).optional(),
  weight_options: z.array(z.any()).optional(),
  generated_content: z.object({
    what_is: z.object({
      description: z.string(),
      origin: z.string(),
      botanical_name: z.string()
    }),
    health_benefits: z.array(z.object({
      name: z.string(),
      description: z.string()
    })),
    culinary_uses: z.array(z.object({
      dish: z.string(),
      tip: z.string()
    })),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string()
    }))
  })
})

export type ProductInput = z.infer<typeof productSchema>
