import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://savikafoods.in'
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/account/',
                    '/cart/',
                    '/checkout/',
                    '/api/',
                ],
            },
        ],
        sitemap: `${base}/sitemap.xml`,
    }
}
