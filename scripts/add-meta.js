const fs = require('fs');
const path = require('path');

const updates = [
  {
    file: 'src/app/(storefront)/shop/page.tsx',
    content: `export const metadata = {
  title: 'Shop All Premium Indian Spices Online',
  description: 'Browse and buy 100% pure Indian spices online - Red Chilli, Turmeric, Garam Masala, Coriander, Chicken Masala, Meat Masala and more. FSSAI certified. Free delivery above Rs.599.',
  alternates: { canonical: 'https://www.savikafoods.in/shop' },
  openGraph: {
    title: 'Shop All Premium Indian Spices | Savika Foods',
    description: 'Browse our complete range of pure, authentic Indian spices.',
    url: 'https://www.savikafoods.in/shop',
  },
};
`
  },
  {
    file: 'src/app/(storefront)/our-story/page.tsx',
    content: `export const metadata = {
  title: 'Our Story - A Legacy of Pure Indian Spices',
  description: 'Learn how Savika Foods sources premium Indian spices directly from farmers across India. Our story of bringing authentic, pure flavour from farm to kitchen.',
  alternates: { canonical: 'https://www.savikafoods.in/our-story' },
};
`
  },
  {
    file: 'src/app/(storefront)/why-savika/page.tsx',
    content: `export const metadata = {
  title: 'Why Choose Savika - Pure, Authentic, FSSAI Certified',
  description: 'Why Savika Foods is different: stone-ground fresh, zero preservatives, direct farm sourcing, FSSAI certified, lab-tested for purity. The honest spice brand India needs.',
  alternates: { canonical: 'https://www.savikafoods.in/why-savika' },
};
`
  },
  {
    file: 'src/app/(storefront)/contact/page.tsx',
    content: `export const metadata = {
  title: 'Contact Savika Foods',
  description: 'Get in touch with Savika Foods. We are based in Gujarat, India. For orders, queries, or wholesale enquiries, reach us at savikafoods@gmail.com or WhatsApp.',
  alternates: { canonical: 'https://www.savikafoods.in/contact' },
};
`
  },
  {
    file: 'src/app/(storefront)/privacy/page.tsx',
    content: `export const metadata = {
  title: 'Privacy Policy',
  description: 'Savika Foods privacy policy. How we collect, use, and protect your personal data.',
  alternates: { canonical: 'https://www.savikafoods.in/privacy' },
  robots: { index: true, follow: false },
};
`
  },
  {
    file: 'src/app/(storefront)/refund-policy/page.tsx',
    content: `export const metadata = {
  title: 'Refund & Return Policy',
  description: 'Savika Foods 7-day easy return and refund policy. Full details on how to return products and get a refund.',
  alternates: { canonical: 'https://www.savikafoods.in/refund-policy' },
};
`
  },
  {
    file: 'src/app/(storefront)/shipping-policy/page.tsx',
    content: `export const metadata = {
  title: 'Shipping Policy - Pan-India Delivery',
  description: 'Savika Foods shipping policy. Free delivery on orders above Rs.599. Pan-India delivery in 3-7 business days. Track your order.',
  alternates: { canonical: 'https://www.savikafoods.in/shipping-policy' },
};
`
  },
  {
    file: 'src/app/(storefront)/terms/page.tsx',
    content: `export const metadata = {
  title: 'Terms & Conditions',
  description: 'Savika Foods terms and conditions. Please read before using our website or placing an order.',
  alternates: { canonical: 'https://www.savikafoods.in/terms' },
};
`
  }
];

const noIndexFiles = [
  'src/app/(storefront)/checkout/page.tsx',
  'src/app/(storefront)/checkout/success/page.tsx',
  'src/app/(storefront)/cart/page.tsx',
  'src/app/(storefront)/account/page.tsx',
  'src/app/(storefront)/orders/page.tsx',
  'src/app/auth/login/page.tsx',
  'src/app/auth/signup/page.tsx'
];

noIndexFiles.forEach(f => {
  updates.push({
    file: f,
    content: `export const metadata = {
  robots: { index: false, follow: false },
};
`
  });
});

for (const update of updates) {
  const filePath = path.join(process.cwd(), update.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('export const metadata')) {
      const isClient = content.includes('"use client"') || content.includes("'use client'");
      if (isClient) {
          console.log(filePath + ' is a client component, adding next-seo or page fallback? Next.js 13+ app dir requires metadata in layout or server component wrapper.');
          // Since it's app router, if it's a client component page, export metadata won't work.
          // In Next.js App Router, page.tsx can be use client, but you can't export metadata from it.
          // You must create a layout.tsx in that folder to export metadata.
      } else {
          // just prepend it
          content = update.content + '\n' + content;
          fs.writeFileSync(filePath, content, 'utf8');
          console.log('Updated ' + update.file);
      }
    } else {
        console.log('Already has metadata: ' + update.file);
    }
  } else {
    console.log('File not found: ' + update.file);
  }
}
