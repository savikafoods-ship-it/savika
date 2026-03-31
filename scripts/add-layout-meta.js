const fs = require('fs');
const path = require('path');

const layouts = [
  {
    dir: 'src/app/(storefront)/contact',
    content: `export const metadata = {
  title: 'Contact Savika Foods',
  description: 'Get in touch with Savika Foods. We are based in Gujarat, India. For orders, queries, or wholesale enquiries, reach us at savikafoods@gmail.com or WhatsApp.',
  alternates: { canonical: 'https://www.savikafoods.in/contact' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`
  },
  {
    dir: 'src/app/(storefront)/checkout',
    content: `export const metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`
  },
  {
    dir: 'src/app/(storefront)/checkout/success',
    content: `export const metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`
  },
  {
    dir: 'src/app/(storefront)/cart',
    content: `export const metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`
  }
];

for (const l of layouts) {
  const layoutPath = path.join(process.cwd(), l.dir, 'layout.tsx');
  if (!fs.existsSync(layoutPath)) {
    fs.writeFileSync(layoutPath, l.content, 'utf8');
    console.log('Created layout for metadata in ' + l.dir);
  } else {
    // If layout already exists, we should probably append metadata to it
    let c = fs.readFileSync(layoutPath, 'utf8');
    if (!c.includes('export const metadata')) {
        const metadataString = l.content.split('export default')[0].trim();
        fs.writeFileSync(layoutPath, metadataString + '\n\n' + c, 'utf8');
        console.log('Appended metadata to existing layout in ' + l.dir);
    } else {
        console.log('Layout in ' + l.dir + ' already has metadata.');
    }
  }
}
