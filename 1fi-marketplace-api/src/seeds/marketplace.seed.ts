// region Imports

// Import Package
import mongoose from 'mongoose';

// Import Config
import { connectDB } from '@/config/database';

// Import Utils
import { logger } from '@/utils/logger';

// Import Models
import { UserModel } from '@/models/user.model';
import { ProductModel } from '@/models/product.model';
import { CategoryModel } from '@/models/category.model';

// Import Interfaces
import {
    IVariantGroup,
    ISpecification,
    IProductImage,
    IEmiPlan,
} from '@/interfaces/product.interface';

// Import Constants
import { IEmiPlanTemplate } from '@/constants/emi-plan-templates.constants';

// Import Services
import { computeEmi } from '@/services/emi.service';

// endregion

const EMI_PLAN_TEMPLATES: IEmiPlanTemplate[] = [
    {
        planId: 'emi-3m',
        tenureMonths: 3,
        interestRate: 0,
        isNoCostEmi: true,
        cashback: 0,
        recommended: false,
    },
    {
        planId: 'emi-6m',
        tenureMonths: 6,
        interestRate: 0,
        isNoCostEmi: true,
        cashback: 0,
        recommended: true,
    },
    {
        planId: 'emi-9m',
        tenureMonths: 9,
        interestRate: 13,
        isNoCostEmi: false,
        cashback: 200,
        recommended: false,
    },
    {
        planId: 'emi-12m',
        tenureMonths: 12,
        interestRate: 14,
        isNoCostEmi: false,
        cashback: 500,
        recommended: false,
    },
];

type CategorySlug = 'smartphones' | 'laptops' | 'wearables' | 'audio' | 'home-appliances';

interface ICategorySeed {
    name: string;
    slug: CategorySlug;
}

const CATEGORY_SEEDS: ICategorySeed[] = [
    { name: 'Smartphones', slug: 'smartphones' },
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Wearables', slug: 'wearables' },
    { name: 'Audio', slug: 'audio' },
    { name: 'Home Appliances', slug: 'home-appliances' },
];

// Escapes text for safe interpolation into inline SVG markup
function escapeSvgText(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Draws a simple category-accurate icon (phone/laptop/watch/headphones/appliance) centered
// around (300, 260) inside a 600x600 viewBox, tinted with the given accent color
function categoryIconMarkup(category: CategorySlug, accent: string): string {
    switch (category) {
        case 'smartphones':
            return `
                <rect x="230" y="90" width="140" height="270" rx="22" fill="${accent}" />
                <rect x="255" y="118" width="90" height="185" rx="6" fill="#ffffff" opacity="0.92" />
                <circle cx="300" cy="335" r="8" fill="#ffffff" opacity="0.92" />
            `;
        case 'laptops':
            return `
                <rect x="185" y="140" width="230" height="145" rx="10" fill="${accent}" />
                <rect x="201" y="154" width="198" height="105" rx="4" fill="#ffffff" opacity="0.92" />
                <path d="M150 285 h300 l18 38 h-336 z" fill="${accent}" />
            `;
        case 'wearables':
            return `
                <rect x="272" y="72" width="56" height="46" rx="14" fill="${accent}" />
                <rect x="272" y="282" width="56" height="46" rx="14" fill="${accent}" />
                <rect x="222" y="118" width="156" height="164" rx="26" fill="${accent}" />
                <rect x="242" y="138" width="116" height="124" rx="14" fill="#ffffff" opacity="0.92" />
            `;
        case 'audio':
            return `
                <path d="M215 260 v-35 a85 85 0 0 1 170 0 v35" fill="none" stroke="${accent}" stroke-width="18" stroke-linecap="round" />
                <rect x="196" y="252" width="46" height="66" rx="16" fill="${accent}" />
                <rect x="358" y="252" width="46" height="66" rx="16" fill="${accent}" />
            `;
        case 'home-appliances':
            return `
                <rect x="205" y="90" width="190" height="270" rx="16" fill="${accent}" />
                <rect x="205" y="205" width="190" height="6" fill="#ffffff" opacity="0.55" />
                <rect x="328" y="114" width="10" height="58" rx="5" fill="#ffffff" opacity="0.85" />
                <rect x="328" y="228" width="10" height="58" rx="5" fill="#ffffff" opacity="0.85" />
            `;
        default:
            return '';
    }
}

// Renders a self-contained SVG data URI as a product/category image — a category-accurate
// icon plus the product's own name, so the image is always genuinely related to the product
// instead of an unrelated stock photo. Fully inline (no external host to go down or drift).
function buildPlaceholderImage(options: {
    label: string;
    category: CategorySlug;
    background: string;
    accent: string;
    width: number;
    height: number;
    showLabel: boolean;
}): string {
    const { label, category, background, accent, width, height, showLabel } = options;
    const labelMarkup = showLabel
        ? `<text x="${width / 2}" y="${height - 34}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#ffffff">${escapeSvgText(label)}</text>`
        : '';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
        <rect width="${width}" height="${height}" fill="${background}" />
        ${categoryIconMarkup(category, accent)}
        ${labelMarkup}
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// One background/accent pair per category, with a couple of tonal variants so a product's
// own gallery images (built from the same category icon) aren't all pixel-identical
const CATEGORY_PALETTE: Record<CategorySlug, Array<{ background: string; accent: string }>> = {
    smartphones: [
        { background: '#4338ca', accent: '#a5b4fc' },
        { background: '#4f46e5', accent: '#c7d2fe' },
        { background: '#3730a3', accent: '#818cf8' },
    ],
    laptops: [
        { background: '#0f766e', accent: '#5eead4' },
        { background: '#0d9488', accent: '#99f6e4' },
        { background: '#115e59', accent: '#2dd4bf' },
    ],
    wearables: [
        { background: '#be185d', accent: '#f9a8d4' },
        { background: '#db2777', accent: '#fbcfe8' },
        { background: '#9d174d', accent: '#f472b6' },
    ],
    audio: [
        { background: '#7c2d12', accent: '#fdba74' },
        { background: '#c2410c', accent: '#fed7aa' },
        { background: '#9a3412', accent: '#fb923c' },
    ],
    'home-appliances': [
        { background: '#334155', accent: '#cbd5e1' },
        { background: '#475569', accent: '#e2e8f0' },
        { background: '#1e293b', accent: '#94a3b8' },
    ],
};

// Builds a category thumbnail image: the category's icon on its brand-accent background
function categoryImage(category: CategorySlug, categoryName: string): string {
    const { background, accent } = CATEGORY_PALETTE[category][0];
    return buildPlaceholderImage({
        label: categoryName,
        category,
        background,
        accent,
        width: 400,
        height: 300,
        showLabel: false,
    });
}

// Builds a product's gallery images: the product's category icon, labeled with the product's
// own name, so every image is unambiguously tied to the product it belongs to
function productImages(name: string, category: CategorySlug, count: number): IProductImage[] {
    const palette = CATEGORY_PALETTE[category];
    return Array.from({ length: count }, (_unused, index) => {
        const { background, accent } = palette[index % palette.length];
        return {
            url: buildPlaceholderImage({
                label: name,
                category,
                background,
                accent,
                width: 600,
                height: 600,
                showLabel: true,
            }),
            alt: `${name} image ${index + 1}`,
        };
    });
}

interface IProductSeed {
    name: string;
    slug: string;
    categorySlug: CategorySlug;
    brand: string;
    price: number;
    originalPrice: number;
    shortDescription: string;
    description: string;
    variants: IVariantGroup[];
    specifications: ISpecification[];
    imageCount: number;
}

const PRODUCT_SEEDS: IProductSeed[] = [
    {
        name: 'Nova X13 Pro',
        slug: 'nova-x13-pro',
        categorySlug: 'smartphones',
        brand: 'Nova',
        price: 54999,
        originalPrice: 64999,
        shortDescription: 'Flagship performance with a stunning pro-grade camera system.',
        description:
            'The Nova X13 Pro delivers flagship-grade performance with a stunning AMOLED display, a versatile triple-camera system, and all-day battery life built for power users.',
        variants: [
            {
                name: 'Storage',
                key: 'storage',
                options: [
                    { label: '128GB', value: '128gb', priceModifier: 0 },
                    { label: '256GB', value: '256gb', priceModifier: 4000 },
                    { label: '512GB', value: '512gb', priceModifier: 9000 },
                ],
            },
            {
                name: 'Color',
                key: 'color',
                options: [
                    { label: 'Midnight Black', value: 'midnight-black', priceModifier: 0 },
                    { label: 'Aurora Blue', value: 'aurora-blue', priceModifier: 0 },
                    { label: 'Silver', value: 'silver', priceModifier: 0 },
                ],
            },
        ],
        specifications: [
            { group: 'Display', label: 'Screen Size', value: '6.7-inch AMOLED' },
            { group: 'Display', label: 'Refresh Rate', value: '120Hz' },
            { group: 'Performance', label: 'Processor', value: 'Octa-core 3.2GHz' },
            { group: 'Performance', label: 'RAM', value: '8GB' },
            { group: 'Battery', label: 'Capacity', value: '5000mAh' },
            { group: 'Camera', label: 'Rear Camera', value: '108MP + 12MP + 5MP' },
        ],
        imageCount: 3,
    },
    {
        name: 'Pulse Air 5G',
        slug: 'pulse-air-5g',
        categorySlug: 'smartphones',
        brand: 'Pulse',
        price: 24999,
        originalPrice: 28999,
        shortDescription: 'A lightweight 5G smartphone built for everyday speed.',
        description:
            'Pulse Air 5G combines a fluid display, dependable 5G connectivity, and a long-lasting battery in a lightweight frame that is easy to carry all day.',
        variants: [
            {
                name: 'Storage',
                key: 'storage',
                options: [
                    { label: '64GB', value: '64gb', priceModifier: 0 },
                    { label: '128GB', value: '128gb', priceModifier: 2000 },
                ],
            },
            {
                name: 'Color',
                key: 'color',
                options: [
                    { label: 'Graphite', value: 'graphite', priceModifier: 0 },
                    { label: 'Coral', value: 'coral', priceModifier: 0 },
                ],
            },
        ],
        specifications: [
            { group: 'Display', label: 'Screen Size', value: '6.5-inch IPS LCD' },
            { group: 'Display', label: 'Refresh Rate', value: '90Hz' },
            { group: 'Performance', label: 'Processor', value: 'Octa-core 2.4GHz' },
            { group: 'Performance', label: 'RAM', value: '6GB' },
            { group: 'Battery', label: 'Capacity', value: '4500mAh' },
            { group: 'Camera', label: 'Rear Camera', value: '50MP + 2MP' },
        ],
        imageCount: 3,
    },
    {
        name: 'Zenith Book 14',
        slug: 'zenith-book-14',
        categorySlug: 'laptops',
        brand: 'Zenith',
        price: 74999,
        originalPrice: 84999,
        shortDescription: 'A premium ultrabook built for productivity on the move.',
        description:
            'The Zenith Book 14 pairs a razor-thin aluminum chassis with a vivid display and all-day battery life, making it an ideal companion for professionals on the go.',
        variants: [
            {
                name: 'RAM',
                key: 'ram',
                options: [
                    { label: '8GB', value: '8gb', priceModifier: 0 },
                    { label: '16GB', value: '16gb', priceModifier: 6000 },
                ],
            },
            {
                name: 'Storage',
                key: 'storage',
                options: [
                    { label: '256GB SSD', value: '256gb-ssd', priceModifier: 0 },
                    { label: '512GB SSD', value: '512gb-ssd', priceModifier: 5000 },
                ],
            },
        ],
        specifications: [
            { group: 'Processor', label: 'CPU', value: '12th Gen Core i5' },
            { group: 'RAM', label: 'Memory', value: '8GB LPDDR5' },
            { group: 'Storage', label: 'Drive', value: '256GB NVMe SSD' },
            { group: 'Display', label: 'Screen Size', value: '14-inch FHD IPS' },
            { group: 'Display', label: 'Brightness', value: '400 nits' },
        ],
        imageCount: 2,
    },
    {
        name: 'Orbit Slim 15',
        slug: 'orbit-slim-15',
        categorySlug: 'laptops',
        brand: 'Orbit',
        price: 59999,
        originalPrice: 69999,
        shortDescription: 'A spacious 15-inch laptop tuned for work and entertainment.',
        description:
            'Orbit Slim 15 offers a generous 15-inch canvas, a comfortable full-size keyboard, and dependable performance for work, streaming, and everything in between.',
        variants: [
            {
                name: 'RAM',
                key: 'ram',
                options: [
                    { label: '8GB', value: '8gb', priceModifier: 0 },
                    { label: '16GB', value: '16gb', priceModifier: 5500 },
                ],
            },
        ],
        specifications: [
            { group: 'Processor', label: 'CPU', value: '11th Gen Core i5' },
            { group: 'RAM', label: 'Memory', value: '8GB DDR4' },
            { group: 'Storage', label: 'Drive', value: '512GB SSD' },
            { group: 'Display', label: 'Screen Size', value: '15.6-inch FHD' },
            { group: 'Display', label: 'Panel', value: 'IPS Anti-Glare' },
        ],
        imageCount: 2,
    },
    {
        name: 'FitTrack Watch S2',
        slug: 'fittrack-watch-s2',
        categorySlug: 'wearables',
        brand: 'FitTrack',
        price: 8999,
        originalPrice: 11999,
        shortDescription: 'A do-it-all smartwatch for fitness and daily notifications.',
        description:
            'FitTrack Watch S2 tracks heart rate, sleep, and dozens of workouts while keeping you connected with smart notifications, all in a durable, all-day design.',
        variants: [
            {
                name: 'Size',
                key: 'size',
                options: [
                    { label: '42mm', value: '42mm', priceModifier: 0 },
                    { label: '46mm', value: '46mm', priceModifier: 1000 },
                ],
            },
            {
                name: 'Color',
                key: 'color',
                options: [
                    { label: 'Black', value: 'black', priceModifier: 0 },
                    { label: 'Silver', value: 'silver', priceModifier: 0 },
                    { label: 'Rose Gold', value: 'rose-gold', priceModifier: 0 },
                ],
            },
        ],
        specifications: [
            { group: 'Display', label: 'Screen', value: '1.4-inch AMOLED' },
            { group: 'Display', label: 'Always-On', value: 'Supported' },
            { group: 'Battery', label: 'Life', value: 'Up to 7 days' },
            { group: 'Sensors', label: 'Heart Rate', value: 'Optical HR Sensor' },
            { group: 'Sensors', label: 'SpO2', value: 'Blood Oxygen Monitor' },
        ],
        imageCount: 3,
    },
    {
        name: 'PulseBeat Band 3',
        slug: 'pulsebeat-band-3',
        categorySlug: 'wearables',
        brand: 'Pulse',
        price: 2999,
        originalPrice: 3999,
        shortDescription: 'A slim fitness band with essential health tracking.',
        description:
            'PulseBeat Band 3 is a lightweight fitness tracker that covers the essentials — steps, sleep, and heart rate — with a battery that lasts up to two weeks.',
        variants: [
            {
                name: 'Color',
                key: 'color',
                options: [
                    { label: 'Black', value: 'black', priceModifier: 0 },
                    { label: 'Blue', value: 'blue', priceModifier: 0 },
                ],
            },
        ],
        specifications: [
            { group: 'Display', label: 'Screen', value: '1.1-inch AMOLED' },
            { group: 'Battery', label: 'Life', value: 'Up to 14 days' },
            { group: 'Sensors', label: 'Heart Rate', value: 'Optical HR Sensor' },
            { group: 'Sensors', label: 'Water Resistance', value: '5 ATM' },
        ],
        imageCount: 2,
    },
    {
        name: 'EchoPods Pro',
        slug: 'echopods-pro',
        categorySlug: 'audio',
        brand: 'Echo',
        price: 6999,
        originalPrice: 8999,
        shortDescription: 'True wireless earbuds with active noise cancellation.',
        description:
            'EchoPods Pro deliver immersive sound with active noise cancellation, a secure comfortable fit, and a compact charging case for music on the move.',
        variants: [
            {
                name: 'Color',
                key: 'color',
                options: [
                    { label: 'White', value: 'white', priceModifier: 0 },
                    { label: 'Black', value: 'black', priceModifier: 0 },
                ],
            },
        ],
        specifications: [
            { group: 'Driver', label: 'Driver Size', value: '11mm Dynamic Driver' },
            { group: 'Battery', label: 'Playback', value: '6 hours (24 with case)' },
            { group: 'Connectivity', label: 'Bluetooth', value: 'Bluetooth 5.3' },
            { group: 'Connectivity', label: 'ANC', value: 'Active Noise Cancellation' },
        ],
        imageCount: 2,
    },
    {
        name: 'SoundWave Studio Headphones',
        slug: 'soundwave-studio-headphones',
        categorySlug: 'audio',
        brand: 'SoundWave',
        price: 12999,
        originalPrice: 15999,
        shortDescription: 'Over-ear studio headphones tuned for rich, balanced sound.',
        description:
            'SoundWave Studio Headphones bring plush over-ear comfort and studio-tuned sound, with a long-lasting battery for extended listening sessions.',
        variants: [
            {
                name: 'Color',
                key: 'color',
                options: [
                    { label: 'Black', value: 'black', priceModifier: 0 },
                    { label: 'Navy', value: 'navy', priceModifier: 0 },
                ],
            },
        ],
        specifications: [
            { group: 'Driver', label: 'Driver Size', value: '40mm Dynamic Driver' },
            { group: 'Battery', label: 'Playback', value: '30 hours' },
            { group: 'Connectivity', label: 'Bluetooth', value: 'Bluetooth 5.2' },
            { group: 'Connectivity', label: 'Wired Mode', value: '3.5mm Audio Jack' },
        ],
        imageCount: 2,
    },
    {
        name: 'ChillAir Mini Fridge 45L',
        slug: 'chillair-mini-fridge-45l',
        categorySlug: 'home-appliances',
        brand: 'ChillAir',
        price: 10999,
        originalPrice: 13999,
        shortDescription: 'A compact 45L fridge perfect for dorms and small spaces.',
        description:
            'ChillAir Mini Fridge 45L offers efficient cooling in a compact footprint, ideal for bedrooms, offices, and dorms where space is at a premium.',
        variants: [
            {
                name: 'Color',
                key: 'color',
                options: [
                    { label: 'White', value: 'white', priceModifier: 0 },
                    { label: 'Red', value: 'red', priceModifier: 500 },
                ],
            },
        ],
        specifications: [
            { group: 'Capacity', label: 'Storage Volume', value: '45 Litres' },
            { group: 'Type', label: 'Cooling Type', value: 'Direct Cool' },
            { group: 'Type', label: 'Door Type', value: 'Single Door' },
            { group: 'Rating', label: 'Energy Rating', value: '3 Star' },
        ],
        imageCount: 2,
    },
    {
        name: 'AeroClean Robot Vacuum',
        slug: 'aeroclean-robot-vacuum',
        categorySlug: 'home-appliances',
        brand: 'AeroClean',
        price: 18999,
        originalPrice: 23999,
        shortDescription: 'A smart robot vacuum with app-controlled cleaning.',
        description:
            'AeroClean Robot Vacuum navigates your home intelligently, delivering powerful suction and app-controlled scheduling to keep floors spotless with minimal effort.',
        variants: [
            {
                name: 'Color',
                key: 'color',
                options: [
                    { label: 'White', value: 'white', priceModifier: 0 },
                    { label: 'Black', value: 'black', priceModifier: 0 },
                ],
            },
        ],
        specifications: [
            { group: 'Capacity', label: 'Dustbin Capacity', value: '0.5 Litres' },
            { group: 'Type', label: 'Navigation', value: 'Smart Gyroscopic Mapping' },
            { group: 'Type', label: 'Control', value: 'App & Voice Control' },
            { group: 'Rating', label: 'Battery Runtime', value: 'Up to 100 minutes' },
        ],
        imageCount: 2,
    },
];

// Computes the standard EMI plan set for a given base price
function buildEmiPlans(basePrice: number): IEmiPlan[] {
    return EMI_PLAN_TEMPLATES.map((template) => computeEmi(basePrice, template));
}

// Wipes existing demo data and repopulates the database with seed users, categories, and products
async function seed(): Promise<void> {
    await connectDB();

    // Clears out all existing users, categories, and products before reseeding
    await Promise.all([
        UserModel.deleteMany({}),
        CategoryModel.deleteMany({}),
        ProductModel.deleteMany({}),
    ]);

    // Creates the demo user account
    await UserModel.create({
        name: 'Demo User',
        email: 'demo@1fi.app',
        password: 'Demo@1234',
        role: 'user',
    });

    // Bulk-inserts all seed categories
    const categoryDocs = await CategoryModel.insertMany(
        CATEGORY_SEEDS.map((category) => ({
            name: category.name,
            slug: category.slug,
            image: categoryImage(category.slug, category.name),
            isActive: true,
        })),
    );

    const categoryIdBySlug = new Map<string, mongoose.Types.ObjectId>();
    for (const category of categoryDocs) {
        categoryIdBySlug.set(category.slug, category._id as mongoose.Types.ObjectId);
    }

    for (const productSeed of PRODUCT_SEEDS) {
        const categoryId = categoryIdBySlug.get(productSeed.categorySlug);

        if (!categoryId) {
            throw new Error(`Category not found for slug: ${productSeed.categorySlug}`);
        }

        const product = new ProductModel({
            name: productSeed.name,
            slug: productSeed.slug,
            brand: productSeed.brand,
            category: categoryId,
            description: productSeed.description,
            shortDescription: productSeed.shortDescription,
            price: productSeed.price,
            originalPrice: productSeed.originalPrice,
            images: productImages(
                productSeed.name,
                productSeed.categorySlug,
                productSeed.imageCount,
            ),
            variants: productSeed.variants,
            specifications: productSeed.specifications,
            emiPlans: buildEmiPlans(productSeed.price),
            isActive: true,
        });

        // Saves each seeded product individually (runs the pre-save discount hook)
        await product.save();
    }

    logger.info('Seed summary', {
        users: 1,
        categories: categoryDocs.length,
        products: PRODUCT_SEEDS.length,
    });
}

seed()
    .then(() => {
        logger.info('Marketplace seed completed successfully');
        return mongoose.disconnect();
    })
    .then(() => {
        process.exit(0);
    })
    .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Unknown error';
        logger.error('Marketplace seed failed', message);
        process.exit(1);
    });
