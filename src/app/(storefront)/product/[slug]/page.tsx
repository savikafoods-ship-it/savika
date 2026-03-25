import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faChevronRight, 
    faCheckCircle, 
    faStar, 
    faShoppingBag, 
    faHeart, 
    faTruck, 
    faRotateLeft, 
    faShieldAlt, 
    faLeaf, 
    faUtensils, 
    faHandshake, 
    faBan, 
    faBookOpen, 
    faHeartPulse, 
    faAward, 
    faQuestionCircle, 
    faChevronDown, 
    faFire, 
    faStore, 
    faArrowRight, 
    faMapMarkerAlt, 
    faGlobe, 
    faUniversity, 
    faMap, 
    faBoxOpen, 
    faClock, 
    faArchive 
} from '@fortawesome/free-solid-svg-icons'
import ProductCommercePanel from '@/components/product/ProductCommercePanel'
import { createClient } from '@/lib/supabase/server'
import { getProductImageUrl } from '@/lib/supabase/imageUrl'

// ─── ISR: revalidate every hour ─────────────────────────────────────────
export const revalidate = 3600

// ─── Product Metadata (rich content not in DB yet) ─────────────────────────

interface WeightOption {
    label: string
    price: number
    salePrice?: number
}

interface ProductData {
    slug: string
    name: string
    localName: string
    category: { slug: string; name: string }
    price: number // Default/Base price for smallest weight
    salePrice?: number // Default/Base sale price
    weightOptions: WeightOption[]
    stock: number
    rating: number
    reviewCount: number
    heroIntro: string
    whatIsThis: string
    origin: string
    botanicalName: string
    culturalImportance: string
    regionalUsage: string
    benefits: { title: string; desc: string }[]
    culinaryUses: { dish: string; tip: string }[]
    storageLife: string
    storageInstructions: string
    sourcingStory: string
    faqs: { q: string; a: string }[]
    keywords: string[]
    metaTitle: string
    metaDescription: string
    relatedProducts: { slug: string; name: string }[]
    image: string
}

const PRODUCT_METADATA: Record<string, any> = {
    'kashmiri-mirch-whole': {
        slug: 'kashmiri-mirch-whole',
        name: 'Kashmiri Mirch Whole',
        localName: 'Kashmiri Lal Mirch / Deggi Mirch',
        category: { slug: 'whole-spices', name: 'Whole Spices' },
        price: 299, salePrice: 199,
        weightOptions: [
            { label: '20gm', price: 69, salePrice: 49 },
            { label: '50gm', price: 149, salePrice: 99 },
            { label: '100gm', price: 299, salePrice: 199 },
            { label: '200gm', price: 549, salePrice: 389 },
            { label: '500gm', price: 1299, salePrice: 899 },
            { label: '1000gm', price: 2499, salePrice: 1699 },
        ],
        stock: 50, rating: 4.8, reviewCount: 218,
        heroIntro: 'Buy authentic Kashmiri Mirch whole online in India - hand-picked from the sunlit valleys of Kashmir. Celebrated for its signature deep crimson colour and gentle warmth, Kashmiri Mirch is the secret behind restaurant-quality biryanis, rogan josh, and tandoori marinades. Unlike ordinary red chilli, it delivers vivid colour with very mild heat, making it perfect for family cooking. 100% natural, chemical-free, and FSSAI certified. Savika sources directly from verified Kashmir farms to bring you fresh, unadulterated spice in every pack.',
        whatIsThis: 'Kashmiri Mirch (Capsicum annuum var. Kashmiriense) is a bright red chilli variety indigenous to the Kashmir valley of northern India. Grown at altitudes between 1,500–2,500 metres, the cool mountain climate and rich volcanic soil give these chilies their characteristic thick skin, deep red pigmentation, and naturally sweet, mildly pungent flavour profile - scoring just 1,000–2,000 on the Scoville scale compared to 30,000–50,000 for regular red chilli.\n\nFor centuries, Kashmiri cuisine has relied entirely on this single variety to achieve the hallmark rich red colour of dishes like Rogan Josh, Dum Aloo, and Kashmiri Pulao without making them too spicy. Mughal court kitchens historically prized Kashmiri red chilli above all others for its aesthetic appeal. Today it remains a GI-tagged product from the Kashmir Valley, meaning authentic Deggi Mirch can only originate from this region.\n\nWhole Kashmiri Mirch is preferred over powder by discerning cooks because the full pod retains its essential oils, colour pigments (primarily capsanthin), and aroma compounds far longer than pre-ground powder. When you bloom whole Kashmiri chilies in hot oil, you extract a gorgeous crimson colour and a sweet warmth that powder simply cannot replicate.',
        origin: 'Kashmir Valley, Jammu & Kashmir, India',
        botanicalName: 'Capsicum annuum var. Kashmiriense',
        culturalImportance: 'GI-tagged product; cornerstone of Kashmiri Pandit and Wazwan cuisines for 400+ years',
        regionalUsage: 'North India, Mughlai cuisine, Hyderabadi biryani, Punjabi curries',
        benefits: [
            { title: 'Rich in Capsanthin', desc: 'The deep red pigment capsanthin is a powerful carotenoid antioxidant that helps fight free radical damage and supports skin health. Research published in Food Chemistry confirms Kashmiri chilli has among the highest capsanthin content of any variety worldwide.' },
            { title: 'Anti-inflammatory Properties', desc: 'Contains capsaicin (in mild quantities) which has well-documented anti-inflammatory effects. Moderate consumption may help reduce chronic inflammation, a root cause of many lifestyle diseases.' },
            { title: 'Vitamin C & A Boost', desc: 'A 10g serving provides approximately 14% of daily Vitamin C and 8% of Vitamin A needs. Both support immune function, vision health, and collagen production.' },
            { title: 'Supports Digestion', desc: 'Capsaicin stimulates the production of gastric enzymes, aiding digestion and improving gut motility. Kashmiri chilli\'s mild heat makes it gentler on the stomach compared to cayenne or bird\'s eye chilli.' },
            { title: 'Iron & Mineral Content', desc: 'Contains iron, potassium, and magnesium. Regular moderate consumption supports blood health and cardiovascular function.' },
        ],
        culinaryUses: [
            { dish: 'Rogan Josh', tip: 'Toast 4–5 whole Kashmiri chilies in ghee before adding other spices - this is what gives authentic rogan josh its iconic red gravy.' },
            { dish: 'Biryani Dum', tip: 'Add 2 whole chilies to the cooking oil before frying onions. Remove before serving for subtle colour and depth without extra heat.' },
            { dish: 'Tandoori Marinades', tip: 'Soak 3 whole chilies in warm water for 20 minutes, then grind to a paste with yoghurt, garlic, and ginger for the most authentic tandoori marinade.' },
            { dish: 'Kashmiri Pulao', tip: 'Temper 2 chilies in ghee with cardamom and bay leaf - the foundation of authentic Kashmiri rice dishes.' },
            { dish: 'Dal Tadka', tip: 'Add 1 whole Kashmiri chilli with curry leaves to the final ghee tadka for a beautiful colour lift and gentle sweetness.' },
            { dish: 'Achaar (Pickles)', tip: 'Whole Kashmiri chilies make stunning visual and flavourful additions to mixed vegetable pickles, balancing heat from other chilli varieties.' },
        ],
        storageLife: '18 months from packaging date',
        storageInstructions: 'Store in an airtight glass jar or zip-lock bag, away from direct sunlight and moisture. Refrigeration is not required but extends colour intensity. Avoid storing near the stove - heat accelerates colour degradation. Once opened, use within 6 months for maximum potency.',
        sourcingStory: 'Savika\'s Kashmiri Mirch is sourced directly from small-batch farmers in the Pulwama and Baramulla districts of Kashmir Valley - the same micro-regions that have produced India\'s finest Deggi Mirch for generations. Our sourcing partner visits farms personally during harvest (October–November) to select only Grade A pods that meet our colour, aroma, and moisture standards. No middlemen. No blending with cheaper chilli varieties. The chilies are sun-dried for 3–4 weeks on elevated bamboo racks to preserve their natural oils, then cold-packed without any artificial colour or preservatives.',
        faqs: [
            { q: 'What is the difference between Kashmiri Mirch and regular red chilli?', a: 'Kashmiri Mirch is much milder (1,000–2,000 Scoville units vs 30,000–50,000 for regular red chilli) and has a significantly deeper red colour due to high capsanthin content. It\'s chosen for colour, not heat.' },
            { q: 'Is Kashmiri Mirch the same as Deggi Mirch?', a: 'Deggi Mirch is technically a blend of Kashmiri red chilli and other mild red chillies. Pure Kashmiri Mirch whole refers specifically to the GI-tagged Kashmiri variety. Our Savika product is 100% pure Kashmiri Mirch without blending.' },
            { q: 'Can I use Kashmiri Mirch powder instead of whole?', a: 'Yes, but whole Kashmiri Mirch retains its colour pigments and essential oils much longer than powder. For best results, use whole when doing a tadka or oil-based cooking step, and grind freshly when you need powder.' },
            { q: 'Is this product FSSAI certified?', a: 'Yes. All Savika spices are FSSAI registered and tested for pesticide residues, moisture content, and adulteration before packaging.' },
            { q: 'How much Kashmiri Mirch should I use per serving?', a: 'For a curry serving 4 people, 2–4 whole chilies suffice for rich colour. Adjust to taste - adding more increases colour without dramatically increasing heat.' },
            { q: 'Do you deliver pan-India?', a: 'Yes. Savika delivers across all states in India within 3–7 business days. Orders above ₹599 include free shipping.' },
        ],
        keywords: ['kashmiri mirch whole', 'buy kashmiri mirch online india', 'kashmiri lal mirch', 'deggi mirch online', 'whole red chilli india', 'kashmiri chilli price india', 'premium kashmiri spices'],
        metaTitle: 'Buy Kashmiri Mirch Whole Online in India | Premium Deggi Mirch | Savika',
        metaDescription: 'Buy authentic Kashmiri Mirch Whole online. GI-tagged, hand-picked from Kashmir Valley. Deep red colour, mild heat. FSSAI certified. Free shipping on ₹599+. Shop Savika Spices.',
        relatedProducts: [
            { slug: 'premium-turmeric-powder', name: 'Premium Turmeric Powder' },
            { slug: 'garam-masala-artisan', name: 'Artisan Garam Masala' },
            { slug: 'kashmiri-saffron', name: 'Kashmiri Saffron' },
        ],
        image: '/images/products/kashmiri-mirch-whole.jpg',
    },
    'premium-turmeric-powder': {
        slug: 'premium-turmeric-powder',
        name: 'Premium Turmeric Powder',
        localName: 'Haldi / Manjal',
        category: { slug: 'ground-powdered', name: 'Ground & Powdered' },
        price: 249, salePrice: 179,
        weightOptions: [
            { label: '50gm', price: 129, salePrice: 89 },
            { label: '100gm', price: 249, salePrice: 179 },
            { label: '200gm', price: 449, salePrice: 329 },
            { label: '500gm', price: 999, salePrice: 749 },
            { label: '1000gm', price: 1899, salePrice: 1399 },
        ],
        stock: 120, rating: 4.9, reviewCount: 412,
        heroIntro: 'Buy premium turmeric powder online in India from Savika - freshly ground from high-curcumin Lakadong turmeric sourced directly from Meghalaya. With a curcumin content of 7–9% (vs 2–3% in ordinary supermarket turmeric), this is India\'s most potent, vibrant turmeric for cooking, wellness, and skin care. FSSAI certified. No artificial colour. Zero adulteration. Delivered fresh across India.',
        whatIsThis: 'Turmeric (Curcuma longa) is the golden root that has been the cornerstone of Indian cooking, Ayurvedic medicine, and religious ritual for over 4,000 years. Belonging to the ginger family (Zingiberaceae), turmeric is a rhizome - an underground stem - that is harvested, dried, and ground into the vivid yellow-orange powder we know as haldi.\n\nIndia produces over 75% of the world\'s turmeric, with major cultivation in Andhra Pradesh, Tamil Nadu, Karnataka, and the northeastern state of Meghalaya. Lakadong turmeric from Meghalaya is considered the gold standard - it consistently tests at 7–9% curcumin content, the active compound responsible for turmeric\'s colour, flavour, and health benefits. Most commercial turmeric contains only 2–3% curcumin.\n\nNo Indian kitchen is complete without turmeric. It appears in virtually every curry, dal, rice dish, and marinade. Beyond cooking, turmeric has been used in Ayurveda for thousands of years as an anti-inflammatory, antiseptic, and immunity booster. Modern science has validated much of this traditional wisdom - curcumin is now one of the most studied natural compounds in biomedical research.',
        origin: 'Lakadong, Meghalaya + Erode, Tamil Nadu (seasonal blend)',
        botanicalName: 'Curcuma longa',
        culturalImportance: 'Sacred spice in Hinduism; used in weddings, puja rituals; cornerstone of Ayurvedic medicine for 4,000+ years',
        regionalUsage: 'All regions of India; Southeast Asia; Middle East; increasingly global for wellness drinks',
        benefits: [
            { title: 'High Curcumin (7–9%)', desc: 'Curcumin is a potent polyphenol with powerful anti-inflammatory and antioxidant properties. Our Lakadong-sourced turmeric contains 3–4x more curcumin than common commercial turmeric.' },
            { title: 'Joint & Inflammation Support', desc: 'Curcumin inhibits NF-κB, a molecule that triggers inflammatory gene expression. Multiple clinical trials show curcumin supplementation reduces joint pain and morning stiffness comparable to some NSAIDs.' },
            { title: 'Liver Detoxification', desc: 'Turmeric stimulates bile production in the liver, improving fat digestion and supporting the liver\'s natural detoxification pathways. Traditional Ayurveda has used haldi for liver health for centuries.' },
            { title: 'Brain Health & Mood', desc: 'Curcumin may increase BDNF (Brain-Derived Neurotrophic Factor), a growth hormone linked to improved memory, reduced risk of depression, and protection against neurodegenerative diseases.' },
            { title: 'Natural Antiseptic', desc: 'Applied topically, turmeric\'s antibacterial properties help in wound healing, acne treatment, and skin brightening - why it\'s central to traditional Indian skincare (ubtan) rituals.' },
            { title: 'Immunity Booster', desc: 'Curcumin modulates immune system responses and has demonstrated antiviral properties in research settings. Golden milk (haldi doodh) remains India\'s most time-tested immunity drink.' },
        ],
        culinaryUses: [
            { dish: 'Everyday Dal & Curry', tip: 'Add ¼ tsp turmeric to tempering oil before adding onions. This blooms the curcumin in fat for maximum absorption and colour.' },
            { dish: 'Golden Milk (Haldi Doodh)', tip: 'Combine ½ tsp turmeric with warm milk, a pinch of black pepper (increases curcumin bioavailability by 2,000%), and honey for the perfect immunity drink.' },
            { dish: 'Rice & Biryani', tip: 'A pinch in the cooking water gives rice a beautiful golden hue. Essential in authentic Hyderabadi dum biryani.' },
            { dish: 'Turmeric Marinades', tip: 'Mix with lemon juice, ginger-garlic paste, and yoghurt for a classic Indian marinade for chicken, fish, or paneer tikka.' },
            { dish: 'Turmeric Latte', tip: 'Increasingly popular globally - blend with oat milk, ginger, cinnamon, and a sweetener of choice for a wellness-forward morning drink.' },
            { dish: 'Sabzi & Stir-fries', tip: 'Always add to vegetables early in cooking so the raw flavour cooks out. Use sparingly - too much turmeric makes dishes bitter.' },
        ],
        storageLife: '24 months from packaging date',
        storageInstructions: 'Store in an airtight dark glass jar away from light and heat. Do not store near the stove. Turmeric is highly pigmented - it stains containers and surfaces. Ceramic or stainless steel containers are ideal. Once opened, use within 12 months for maximum curcumin potency.',
        sourcingStory: 'Savika\'s turmeric comes primarily from Lakadong village in Meghalaya\'s Jaintia Hills - India\'s highest-curcumin turmeric-growing region. Our sourcing partner works directly with tribal farmer cooperatives who have cultivated this specific variety for generations using traditional organic methods. Roots are harvested in January–February at peak maturity, boiled briefly, sun-dried for 10–15 days, then stone-ground in small batches to preserve volatile oils. Each batch is third-party tested for curcumin percentage before packaging.',
        faqs: [
            { q: 'Why is Savika turmeric more yellow-orange than supermarket brands?', a: 'Our Lakadong turmeric has 7–9% curcumin vs 2–3% in commercial brands. Higher curcumin = more intense, vivid colour. No artificial colour is added.' },
            { q: 'Is this organic turmeric?', a: 'Our Lakadong source uses traditional farming methods without synthetic pesticides. While not formally certified organic due to certification costs for small tribal farmers, we test every batch for pesticide residues.' },
            { q: 'How should I maximize curcumin absorption?', a: 'Curcumin has poor bioavailability on its own. Combine with black pepper (piperine increases absorption by 2,000%) and consume with healthy fats (ghee, coconut oil) for maximum benefit.' },
            { q: 'Can I use turmeric on my skin?', a: 'Yes. Mix with chickpea flour, milk/rose water, and a few drops of oil for a traditional ubtan face pack. Note: it will temporarily stain skin yellow - use at night or wash off within 15 minutes.' },
            { q: 'Is this safe during pregnancy?', a: 'Culinary amounts of turmeric in food are safe during pregnancy. However, high-dose turmeric supplements should be avoided. Consult your doctor if supplementing.' },
            { q: 'What\'s the difference between turmeric and saffron?', a: 'Both are yellow spices but completely different. Turmeric is earthy and used for colour+flavour in curries. Saffron is floral, precious, and used in small amounts in biryanis and sweets for aroma and subtle colour.' },
        ],
        keywords: ['premium turmeric powder india', 'buy haldi online india', 'lakadong turmeric', 'high curcumin turmeric', 'organic turmeric powder india', 'turmeric powder price india', 'fresh turmeric powder online'],
        metaTitle: 'Buy Premium Turmeric Powder Online in India | Lakadong Haldi | Savika',
        metaDescription: 'Buy premium Lakadong turmeric powder online - 7-9% curcumin, freshly ground, zero adulteration. FSSAI certified. Pan-India delivery. Free shipping on ₹599+. Shop Savika.',
        relatedProducts: [
            { slug: 'kashmiri-mirch-whole', name: 'Kashmiri Mirch Whole' },
            { slug: 'garam-masala-artisan', name: 'Artisan Garam Masala' },
            { slug: 'coriander-powder', name: 'Coriander Powder' },
        ],
        image: '/images/products/premium-turmeric-powder.jpg',
    },
    'garam-masala-artisan': {
        slug: 'garam-masala-artisan',
        name: 'Artisan Garam Masala',
        localName: 'Garam Masala / Spice Mix',
        category: { slug: 'blends-masalas', name: 'Blends & Masalas' },
        price: 349, salePrice: 249,
        weightOptions: [
            { label: '50gm', price: 189, salePrice: 129 },
            { label: '100gm', price: 349, salePrice: 249 },
            { label: '200gm', price: 649, salePrice: 479 },
            { label: '500gm', price: 1499, salePrice: 1099 },
        ],
        stock: 75, rating: 4.9, reviewCount: 289,
        heroIntro: 'Buy Savika Artisan Garam Masala online in India...',
        whatIsThis: 'Garam Masala is arguably India\'s most important spice blend...',
        origin: 'Multi-origin blend; blended in Mumbai',
        botanicalName: '14-spice blend',
        culturalImportance: 'The defining blend of North Indian cuisine.',
        regionalUsage: 'Pan-India',
        benefits: [
            { title: 'Digestive Support', desc: 'Improves digestion and reduces bloating.' },
            { title: 'Antioxidant Rich', desc: 'High in protective plant compounds.' }
        ],
        culinaryUses: [
            { dish: 'Curries', tip: 'Add at the end of cooking for maximum aroma.' }
        ],
        storageLife: '12 months',
        storageInstructions: 'Store in an airtight container away from heat.',
        sourcingStory: 'Each component is sourced independently from its best-in-class origin.',
        faqs: [
            { q: 'Is there any salt added?', a: 'No, it is 100% pure spices.' }
        ],
        keywords: ['garam masala online'],
        metaTitle: 'Buy Artisan Garam Masala Online | Savika',
        metaDescription: 'Freshly ground 14-spice blend.',
        relatedProducts: [
            { slug: 'kashmiri-mirch-whole', name: 'Kashmiri Mirch Whole' },
            { slug: 'premium-turmeric-powder', name: 'Premium Turmeric Powder' }
        ],
        image: '/images/products/garam-masala-artisan.jpg',
    },
    'coriander-powder': {
        slug: 'coriander-powder',
        name: 'Coriander Powder',
        localName: 'Dhaniya Powder',
        category: { slug: 'ground-powdered', name: 'Ground & Powdered' },
        price: 249, salePrice: 165,
        weightOptions: [
            { label: '100gm', price: 129, salePrice: 89 },
            { label: '200gm', price: 249, salePrice: 165 },
            { label: '500gm', price: 549, salePrice: 389 },
        ],
        stock: 90, rating: 4.8, reviewCount: 156,
        heroIntro: 'Freshly ground coriander with an unmistakable khushboo...',
        whatIsThis: 'Coriander powder is derived from the seeds of the Coriandrum sativum plant.',
        origin: 'Rajasthan, India',
        botanicalName: 'Coriandrum sativum',
        culturalImportance: 'An essential base spice for almost all Indian savory dishes.',
        regionalUsage: 'Every Indian household',
        benefits: [
            { title: 'Digestive Health', desc: 'Known to soothe the stomach and support healthy digestion.' },
            { title: 'Cholesterol Management', desc: 'May help in maintaining healthy cholesterol levels.' }
        ],
        culinaryUses: [{ dish: 'Basic Curry Base', tip: 'Mix with turmeric and chilli powder.' }],
        storageLife: '12 months',
        storageInstructions: 'Keep in a cool, dry place in an airtight jar.',
        sourcingStory: 'Sourced from the best coriander growing regions in Rajasthan.',
        faqs: [{ q: 'Is it roasted?', a: 'We lightly sun-dry the seeds before grinding.' }],
        keywords: ['coriander powder online', 'dhaniya powder buy'],
        metaTitle: 'Buy Pure Coriander Powder Online | Savika',
        metaDescription: 'Freshly ground aromatic coriander powder.',
        relatedProducts: [{ slug: 'premium-turmeric-powder', name: 'Premium Turmeric Powder' }],
        image: '/images/products/coriander-powder.jpg'
    },
    'chicken-masala': {
        slug: 'chicken-masala',
        name: 'Chicken Masala',
        localName: 'Murgh Masala Mix',
        category: { slug: 'blends-masalas', name: 'Blends & Masalas' },
        price: 299, salePrice: 225,
        weightOptions: [
            { label: '50gm', price: 149, salePrice: 119 },
            { label: '100gm', price: 299, salePrice: 225 },
            { label: '200gm', price: 549, salePrice: 429 },
        ],
        stock: 150, rating: 4.9, reviewCount: 342,
        heroIntro: 'Specially crafted masala blend for chicken curries...',
        whatIsThis: 'A robust blend of traditional spices specifically balanced to enhance poultry dishes.',
        origin: 'Multiple origins, blended in Mumbai',
        botanicalName: 'Spice Blend',
        culturalImportance: 'The secret to restaurant-style chicken curries at home.',
        regionalUsage: 'Northern and Central India',
        benefits: [{ title: 'Metabolism Boost', desc: 'Contains warming spices that support a healthy metabolism.' }, { title: 'Rich in Antioxidants', desc: 'Packed with cloves and cardamom.' }],
        culinaryUses: [{ dish: 'Chicken Tikka', tip: 'Marinate with yoghurt and this masala for at least 2 hours.' }],
        storageLife: '12 months',
        storageInstructions: 'Store in an airtight container.',
        sourcingStory: 'Our master blenders use a 30-year-old recipe.',
        faqs: [{ q: 'Is it very spicy?', a: 'Medium heat profile, focusing on aroma.' }],
        keywords: ['chicken masala online'],
        metaTitle: 'Buy Best Chicken Masala Online | Savika',
        metaDescription: 'Authentic aromatic chicken masala blend.',
        relatedProducts: [{ slug: 'garam-masala-artisan', name: 'Artisan Garam Masala' }],
        image: '/images/products/biryani-masala.jpg'
    },
    'meat-masala': {
        slug: 'meat-masala',
        name: 'Meat Masala',
        localName: 'Mutton / Meat Spice Mix',
        category: { slug: 'blends-masalas', name: 'Blends & Masalas' },
        price: 325, salePrice: 245,
        weightOptions: [
            { label: '50gm', price: 169, salePrice: 129 },
            { label: '100gm', price: 325, salePrice: 245 },
            { label: '200gm', price: 599, salePrice: 469 },
        ],
        stock: 120, rating: 4.9, reviewCount: 198,
        heroIntro: 'A bold, robust blend for mutton, lamb, and beef preparations...',
        whatIsThis: 'A strong, pepper-forward spice blend designed to penetrate and tenderise red meats.',
        origin: 'Regional Indian blend',
        botanicalName: 'Spice Blend',
        culturalImportance: 'A must-have for Sunday mutton curries across India.',
        regionalUsage: 'Pan-India',
        benefits: [{ title: 'Digestion of Fats', desc: 'Aids in the breakdown of heavy meat proteins.' }, { title: 'Iron Absorption', desc: 'May help in better absorption of iron.' }],
        culinaryUses: [{ dish: 'Slow Cooked Mutton', tip: 'Add half the masala during sautéing.' }],
        storageLife: '12 months',
        storageInstructions: 'Keep away from moisture.',
        sourcingStory: 'Inspired by traditional Rajasthani and Mughlai meat preparations.',
        faqs: [{ q: 'Can I use this for beef?', a: 'Yes, it works exceptionally well.' }],
        keywords: ['mutton masala buy'],
        metaTitle: 'Buy Robust Meat Masala Online | Savika',
        metaDescription: 'Bold and robust spice blend for red meat.',
        relatedProducts: [{ slug: 'kashmiri-mirch-whole', name: 'Kashmiri Mirch Whole' }],
        image: '/images/products/black-pepper-malabar.jpg'
    },
    'deshi-ghati-masala': {
        slug: 'deshi-ghati-masala',
        name: 'Deshi Ghati Masala',
        localName: 'Ghati Masala / Malvani Style',
        category: { slug: 'blends-masalas', name: 'Blends & Masalas' },
        price: 395, salePrice: 325,
        weightOptions: [
            { label: '50gm', price: 199, salePrice: 169 },
            { label: '100gm', price: 395, salePrice: 325 },
            { label: '200gm', price: 749, salePrice: 629 },
        ],
        stock: 40, rating: 5.0, reviewCount: 87,
        heroIntro: 'A rare traditional masala from the Ghati region...',
        whatIsThis: 'An extremely aromatic and fiery blend from the Western Ghats of Maharashtra...',
        origin: 'Maharashtra, India',
        botanicalName: 'Spice Blend',
        culturalImportance: 'The soul of Maharashtrian Ghati cuisine.',
        regionalUsage: 'Maharashtra, Goa, North Karnataka',
        benefits: [{ title: 'Heart Health', desc: 'Rich in spices that support healthy circulation.' }, { title: 'Immunity', desc: 'Provides a natural immunity boost.' }],
        culinaryUses: [{ dish: 'Veg/Non-Veg Misal', tip: 'Key ingredient for an authentic spicy misal.' }],
        storageLife: '9 months',
        storageInstructions: 'Best used fresh; store in a cool, dark place.',
        sourcingStory: 'The recipe comes from a 4th generation spice blender.',
        faqs: [{ q: 'Is it very hot?', a: 'Yes, bold heat and intense spice profile.' }],
        keywords: ['ghati masala buy online'],
        metaTitle: 'Buy Traditional Deshi Ghati Masala | Savika',
        metaDescription: 'Authentic Maharashtrian Ghati spice blend.',
        relatedProducts: [{ slug: 'garam-masala-artisan', name: 'Artisan Garam Masala' }],
        image: '/images/products/star-anise-whole.jpg'
    }
};

async function getProduct(slug: string) {
    const supabase = await createClient()
    const { data: product } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .single()
    return product
}

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
    const supabase = await createClient()
    const { data: products } = await supabase.from('products').select('slug')
    return (products || []).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const p = await getProduct(slug)
    const meta = PRODUCT_METADATA[slug] || {}
    
    if (!p) return { title: 'Product Not Found | Savika' }

    return {
        title: meta.metaTitle || `${p.name} | Savika`,
        description: meta.metaDescription || p.description,
        keywords: (meta.keywords || []).join(', '),
        openGraph: {
            title: meta.metaTitle || p.name,
            description: meta.metaDescription || p.description,
            url: `https://savikafoods.in/product/${slug}`,
            siteName: 'Savika',
            images: [{ url: getProductImageUrl(p.image_urls?.[0]), width: 1200, height: 630, alt: p.name }],
            locale: 'en_IN',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: meta.metaTitle || p.name,
            description: meta.metaDescription || p.description,
            images: [getProductImageUrl(p.image_urls?.[0])],
        },
        alternates: {
            canonical: `https://savikafoods.in/product/${slug}`,
        },
    }
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params
    const p = await getProduct(slug)
    if (!p) notFound()

    // Enrich with local metadata if available
    const meta = PRODUCT_METADATA[slug] || {
        heroIntro: p.description,
        whatIsThis: p.description,
        origin: 'India',
        botanicalName: 'N/A',
        culturalImportance: 'N/A',
        regionalUsage: 'N/A',
        benefits: [],
        culinaryUses: [],
        storageLife: '12 months',
        storageInstructions: 'Store in a cool, dry place.',
        sourcingStory: 'Sourced from the finest farms.',
        faqs: [],
        relatedProducts: [],
    }

    // Merge weight options from DB if they exist, otherwise use default
    const weightOptions = p.weight_options || meta.weightOptions || [
        { label: '100g', price: p.price, salePrice: p.sale_price }
    ]

    const enrichedProduct = {
        ...p,
        ...meta,
        weightOptions
    }

    const currentPrice = enrichedProduct.price
    const currentSalePrice = enrichedProduct.sale_price
    const savings = currentSalePrice ? currentPrice - currentSalePrice : 0
    const savingsPct = savings > 0 ? Math.round((savings / currentPrice) * 100) : 0

    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: enrichedProduct.name,
        description: enrichedProduct.heroIntro?.slice(0, 500) || enrichedProduct.description?.slice(0, 500),
        image: [getProductImageUrl(enrichedProduct.image_urls?.[0])],
        brand: { '@type': 'Brand', name: 'Savika' },
        sku: enrichedProduct.id,
        offers: {
            '@type': 'Offer',
            price: enrichedProduct.sale_price ?? enrichedProduct.price,
            priceCurrency: 'INR',
            availability: enrichedProduct.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `https://savikafoods.in/product/${slug}`,
        },
    }

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://savikafoods.in' },
            { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://savikafoods.in/shop' },
            { '@type': 'ListItem', position: 3, name: enrichedProduct.category?.name, item: `https://savikafoods.in/category/${enrichedProduct.category?.slug}` },
            { '@type': 'ListItem', position: 4, name: enrichedProduct.name, item: `https://savikafoods.in/product/${slug}` },
        ],
    }

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: (enrichedProduct.faqs || []).map((f: any) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    }

    return (
        <div className="min-h-screen bg-[#F9F4EE]">
            {/* JSON-LD */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

            {/* ── Breadcrumb ── */}
            <div className="bg-white border-b border-[#e8ddd0] py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400">
                        <Link href="/" className="hover:text-[#C17F24] transition-colors">Home</Link>
                        <FontAwesomeIcon icon={faChevronRight} className="w-2 h-2" />
                        <Link href="/shop" className="hover:text-[#C17F24] transition-colors">Shop</Link>
                        <FontAwesomeIcon icon={faChevronRight} className="w-2 h-2" />
                        <Link href={`/category/${enrichedProduct.category?.slug}`} className="hover:text-[#C17F24] transition-colors">{enrichedProduct.category?.name}</Link>
                        <FontAwesomeIcon icon={faChevronRight} className="w-2 h-2" />
                        <span className="text-[#C17F24] font-medium line-clamp-1">{enrichedProduct.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">

                {/* ══════════════════════════════════════════════════
                    SECTION 1 - HERO + COMMERCE
                ══════════════════════════════════════════════════ */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Product Gallery */}
                    <div className="space-y-3">
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-xl">
                            <Image
                                src={getProductImageUrl(enrichedProduct.image_urls?.[0])}
                                alt={`${enrichedProduct.name} - Buy Online India | Savika`}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                                priority
                            />
                            {savingsPct > 0 && (
                                <div className="absolute top-4 left-4 bg-[#C47F17] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                    {savingsPct}% OFF
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 text-[#2E2E2E] text-xs font-semibold px-3 py-1.5 rounded-full shadow flex items-center gap-1">
                                <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-green-600" />
                                FSSAI Certified
                            </div>
                        </div>
                        {/* Thumbnail row placeholder */}
                        <div className="grid grid-cols-4 gap-2">
                            {enrichedProduct.image_urls?.slice(0, 4).map((url: string, i: number) => (
                                <div key={i} className="aspect-square rounded-xl bg-white shadow border-2 border-transparent hover:border-[#C47F17] transition-all cursor-pointer overflow-hidden relative">
                                    <Image src={getProductImageUrl(url)} alt={`${enrichedProduct.name} view ${i}`} fill sizes="80px" className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Commerce Panel */}
                    <div className="space-y-6">
                        {/* H1 */}
                        <div>
                            <p className="text-sm text-[#C47F17] font-semibold uppercase tracking-widest mb-1">
                                {enrichedProduct.category?.name}
                            </p>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1A0E] leading-tight">
                                Buy {enrichedProduct.name} Online in India
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 italic">{enrichedProduct.localName}</p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FontAwesomeIcon 
                                        key={i} 
                                        icon={faStar} 
                                        className={`w-4 h-4 ${i < Math.floor(enrichedProduct.rating || 4.8) ? 'text-[#C17F24]' : 'text-gray-300'}`} 
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-semibold text-[#2E2E2E]">{enrichedProduct.rating || 4.8}</span>
                            <span className="text-sm text-gray-400">({enrichedProduct.review_count || enrichedProduct.reviewCount || 0} reviews)</span>
                        </div>

                        {/* ProductCommercePanel replaces the static WeightSelector and buttons */}
                        <ProductCommercePanel productData={enrichedProduct} />
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    SECTION 2 - WHAT IS THIS SPICE?
                ══════════════════════════════════════════════════ */}
                <section className="bg-white rounded-3xl p-8 shadow-sm border border-[#e8ddd0]">
                    <SectionHeading icon={faBookOpen} text={`What Is ${enrichedProduct.name.split(' ')[0]}?`} />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                        <div className="lg:col-span-2 space-y-4">
                            {enrichedProduct.whatIsThis?.split('\n\n').map((para: string, i: number) => (
                                <p key={i} className="text-gray-600 leading-relaxed">{para}</p>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <InfoCard label="Origin" value={enrichedProduct.origin} icon={faMapMarkerAlt} />
                            <InfoCard label="Local Name" value={enrichedProduct.localName} icon={faGlobe} />
                            <InfoCard label="Botanical Name" value={enrichedProduct.botanicalName} icon={faLeaf} italic />
                            <InfoCard label="Cultural Role" value={enrichedProduct.culturalImportance} icon={faUniversity} />
                            <InfoCard label="Regional Use" value={enrichedProduct.regionalUsage} icon={faMap} />
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    SECTION 3 - HEALTH BENEFITS
                ══════════════════════════════════════════════════ */}
                <section>
                    <SectionHeading icon={faHeartPulse} text={`Health Benefits of ${enrichedProduct.name.split(' ')[0]}`} />
                    <p className="text-gray-500 mt-2 mb-6 max-w-2xl">
                        Backed by traditional Ayurvedic wisdom and modern nutritional science.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {enrichedProduct.benefits?.map((b: any, i: number) => (
                            <div key={i} className="bg-white rounded-2xl p-5 border border-[#e8ddd0] hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-[#C47F17]/10 flex items-center justify-center mb-3">
                                    <FontAwesomeIcon icon={faLeaf} className="w-4 h-4 text-[#C17F24]" />
                                </div>
                                <h3 className="font-bold text-[#2C1A0E] mb-2">{b.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-4 italic">
                        * These statements are for informational purposes only. This product is not intended to diagnose, treat, cure, or prevent any disease.
                    </p>
                </section>

                {/* ══════════════════════════════════════════════════
                    SECTION 4 - CULINARY USES
                ══════════════════════════════════════════════════ */}
                <section className="bg-[#2C1A0E] rounded-3xl p-8">
                    <SectionHeading icon={faUtensils} text="Culinary Uses & Cooking Tips" dark />
                    <p className="text-gray-400 mt-2 mb-6">How to use {enrichedProduct.name} like an Indian chef</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {enrichedProduct.culinaryUses?.map((u: any, i: number) => (
                            <div key={i} className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <FontAwesomeIcon icon={faUtensils} className="w-4 h-4 text-[#C17F24]" />
                                    <h3 className="font-bold text-white">{u.dish}</h3>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">{u.tip}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    SECTION 5 - WHY CHOOSE SAVIKA
                ══════════════════════════════════════════════════ */}
                <section>
                    <SectionHeading icon={faAward} text="Why Choose Savika?" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
                        {[
                            { icon: faUtensils, title: 'Stone Ground Fresh', desc: 'Ground in small batches to preserve essential oils and peak flavour' },
                            { icon: faHandshake, title: 'Ethical Direct Sourcing', desc: 'Directly from verified farms - no middlemen, fair farmer prices' },
                            { icon: faBan, title: 'Zero Preservatives', desc: 'No artificial colour, no salt, no anti-caking agents - ever' },
                            { icon: faTruck, title: 'Pan-India Shipping', desc: 'Delivered to all 28 states within 3-7 business days' },
                        ].map((f) => (
                            <div key={f.title} className="bg-[#FFF8F0] rounded-2xl p-5 border border-[#e8ddd0] text-center">
                                <div className="w-12 h-12 rounded-full bg-[#C17F24]/15 flex items-center justify-center mx-auto mb-3">
                                    <FontAwesomeIcon icon={f.icon} className="w-5 h-5 text-[#C17F24]" />
                                </div>
                                <h3 className="font-bold text-[#2C1A0E] mb-1">{f.title}</h3>
                                <p className="text-xs text-gray-500">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    SECTION 6 - STORAGE & SHELF LIFE
                ══════════════════════════════════════════════════ */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-3xl p-7 border border-[#e8ddd0]">
                        <h2 className="text-xl font-extrabold text-[#2C1A0E] mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faBoxOpen} className="w-5 h-5 text-[#C17F24]" />
                            Storage &amp; Shelf Life
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#C47F17]/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <FontAwesomeIcon icon={faClock} className="w-3 h-3 text-[#C17F24]" />
                                </div>
                                <div>
                                    <p className="font-semibold text-[#2C1A0E] text-sm">Shelf Life</p>
                                    <p className="text-sm text-gray-500">{enrichedProduct.storageLife}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#C47F17]/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <FontAwesomeIcon icon={faArchive} className="w-3 h-3 text-[#C17F24]" />
                                </div>
                                <div>
                                    <p className="font-semibold text-[#2C1A0E] text-sm">How to Store</p>
                                    <p className="text-sm text-gray-500">{enrichedProduct.storageInstructions}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ──────── Sourcing Story ──────── */}
                    <section className="bg-[#FFF8F0] rounded-3xl p-7 border border-[#e8ddd0]">
                        <h2 className="text-xl font-extrabold text-[#2C1A0E] mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faLeaf} className="w-5 h-5 text-[#C17F24]" />
                            Sourcing Story
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed">{enrichedProduct.sourcingStory}</p>
                        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#C47F17]">
                            <FontAwesomeIcon icon={faLeaf} className="w-3 h-3" />
                            <span>Farm-to-kitchen transparency</span>
                        </div>
                    </section>
                </section>

                {/* ══════════════════════════════════════════════════
                    SECTION 7 - FAQ
                ══════════════════════════════════════════════════ */}
                <section>
                    <SectionHeading icon={faQuestionCircle} text="Frequently Asked Questions" />
                    <div className="mt-6 space-y-3 max-w-3xl">
                        {enrichedProduct.faqs?.map((faq: any, i: number) => (
                            <details
                                key={i}
                                className="group bg-white rounded-2xl border border-[#e8ddd0] overflow-hidden"
                            >
                                <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-semibold text-[#2C1A0E] hover:bg-[#FFF8F0] transition-colors">
                                    <span>{faq.q}</span>
                                    <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3 text-[#C17F24] group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-[#e8ddd0] pt-4">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    SECTION 8 - INTERNAL LINKS / RELATED PRODUCTS
                ══════════════════════════════════════════════════ */}
                <section className="pb-4">
                    <SectionHeading icon={faFire} text="You May Also Like" />
                    <div className="flex flex-wrap gap-4 mt-5">
                        {enrichedProduct.relatedProducts?.map((rp: any) => (
                            <Link
                                key={rp.slug}
                                href={`/product/${rp.slug}`}
                                className="flex items-center gap-2 bg-white border border-[#e8ddd0] hover:border-[#C47F17] hover:bg-[#FFF8F0] text-[#2C1A0E] font-semibold px-4 py-2.5 rounded-full text-sm transition-all"
                            >
                                <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 text-[#C17F24]" />
                                {rp.name}
                            </Link>
                        ))}
                        <Link
                            href="/shop"
                            className="flex items-center gap-2 bg-[#C47F17]/10 border border-[#C47F17]/30 hover:bg-[#C47F17] hover:text-white text-[#C47F17] font-semibold px-4 py-2.5 rounded-full text-sm transition-all"
                        >
                            <FontAwesomeIcon icon={faStore} className="w-3 h-3" />
                            View Complete Indian Spice Collection
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    )
}

// ─── Sub-components ──────────────────────────────────────────────────────

function SectionHeading({ icon, text, dark }: { icon: any; text: string; dark?: boolean }) {
    return (
        <h2 className={`text-2xl font-extrabold flex items-center gap-3 ${dark ? 'text-white' : 'text-[#2C1A0E]'}`}>
            <div className="w-9 h-9 rounded-xl bg-[#C17F24]/20 flex items-center justify-center">
                <FontAwesomeIcon icon={icon} className="w-4 h-4 text-[#C17F24]" />
            </div>
            {text}
        </h2>
    )
}

function InfoCard({ label, value, icon, italic }: { label: string; value: string; icon: any; italic?: boolean }) {
    return (
        <div className="bg-[#FFF8F0] rounded-xl p-4 border border-[#e8ddd0]">
            <div className="flex items-center gap-2 mb-1">
                <FontAwesomeIcon icon={icon} className="w-3 h-3 text-[#C17F24]" />
                <span className="text-xs font-bold text-[#8E562E] uppercase tracking-wider">{label}</span>
            </div>
            <p className={`text-sm text-[#2C1A0E] font-medium ${italic ? 'italic' : ''}`}>{value}</p>
        </div>
    )
}

function WeightSelector({ options }: { options: string[] }) {
    // Client interaction - uses details/summary for no-JS fallback
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((opt, i) => (
                <button
                    key={opt}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${i === 1
                        ? 'border-[#C47F17] bg-[#C47F17] text-white'
                        : 'border-[#e8ddd0] bg-white text-[#2E2E2E] hover:border-[#C47F17]'
                        }`}
                >
                    {opt}
                </button>
            ))}
        </div>
    )
}
