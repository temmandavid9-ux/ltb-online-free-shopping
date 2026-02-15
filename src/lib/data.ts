
import type { Product, Category } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { Shirt, Laptop, Watch, Dna, Footprints, Layers, Smartphone, Link as LinkIcon, Palette } from 'lucide-react';

const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    // Return a default placeholder if no image is found
    return { url: 'https://placehold.co/600x400', hint: 'placeholder' };
  }
  return { url: image.imageUrl, hint: image.imageHint };
};

export const categories: Category[] = [
  { id: 'cat1', name: 'Clothes', icon: Shirt },
  { id: 'cat2', name: 'Wigs', icon: Dna },
  { id: 'cat3', name: 'Laptops', icon: Laptop },
  { id: 'cat4', name: 'Shoes', icon: Footprints },
  { id: 'cat5', name: 'Watches', icon: Watch },
  { id: 'cat6', name: 'Underwear', icon: Layers },
  { id: 'cat7', name: 'Chains', icon: LinkIcon },
  { id: 'cat8', name: 'Phones', icon: Smartphone },
  { id: 'cat9', name: 'Beauty', icon: Palette },
];

export const brands: string[] = ['Zenco', 'Stellar', 'Nexa', 'Orion', 'Helios', 'iDino', 'Aperture', 'Denim Edge', 'Alpine Ridge', 'Velocity', 'Tempo', 'Zenith', 'SilkFlow', 'Eon', 'Nova', 'Crimson', 'Eco', 'Stride', 'Vivid', 'Chrono'];

export const products: Product[] = [
  {
    id: 'prod_1',
    slug: 'stellar-gold-watch',
    name: 'Stellar Sovereign Gold Watch',
    description: 'Define your legacy with the Stellar Sovereign. A masterpiece of precision engineering and 18k gold, this watch is for those who command respect. Make a statement of pure, undiluted elegance.',
    category: 'Watches',
    price: 2899.99,
    brand: 'Stellar',
    images: [findImage('prod_img_1')],
    stock: 12,
    rating: 4.9,
    reviewCount: 145
  },
  {
    id: 'prod_2',
    slug: 'helios-chronograph',
    name: 'Helios Apex Chronograph',
    description: 'Master time with the Helios Apex Chronograph. Fusing aerospace-grade titanium with classic functionality, this is an essential tool for the modern pioneer who values style and substance.',
    category: 'Watches',
    price: 2150.50,
    brand: 'Helios',
    images: [findImage('prod_img_2')],
    stock: 22,
    rating: 4.8,
    reviewCount: 110
  },
  {
    id: 'prod_3',
    slug: 'zenco-ultrabook',
    name: 'Zenco Zephyr Ultrabook',
    description: 'Unleash your potential with the Zenco Zephyr. Impossibly sleek and astonishingly powerful, it packs immense performance for seamless creativity and entertainment, wherever inspiration strikes.',
    category: 'Laptops',
    price: 1725.00,
    brand: 'Zenco',
    images: [findImage('prod_img_3')],
    stock: 9,
    rating: 4.9,
    reviewCount: 230
  },
  {
    id: 'prod_4',
    slug: 'nexa-pro-laptop',
    name: 'Nexa Vanguard Pro Laptop',
    description: 'Lead the charge with the Nexa Vanguard Pro. Engineered with next-gen performance and a breathtaking 4K display, it’s the ultimate machine for professionals who demand nothing but the best.',
    category: 'Laptops',
    price: 2399.00,
    brand: 'Nexa',
    images: [findImage('prod_img_4')],
    stock: 7,
    rating: 5.0,
    reviewCount: 198
  },
  {
    id: 'prod_5',
    slug: 'orion-cotton-tee',
    name: 'Orion Supima Cotton Tee',
    description: 'Rediscover a legend. The Orion Supima Cotton Tee is the cornerstone of any refined wardrobe, offering a sublimely soft feel and a fit so perfect, you’ll need one in every color.',
    category: 'Clothes',
    price: 165.00,
    brand: 'Orion',
    images: [findImage('prod_img_5')],
    stock: 150,
    rating: 4.6,
    reviewCount: 350
  },
  {
    id: 'prod_6',
    slug: 'stellar-runners',
    name: 'Stellar Apex Runners',
    description: 'Elevate every stride with the Stellar Apex Runners. Meticulously engineered for peak athletic performance and unparalleled comfort, these are the shoes that will carry you across the finish line.',
    category: 'Shoes',
    price: 210.00,
    brand: 'Stellar',
    images: [findImage('prod_img_6')],
    stock: 45,
    rating: 4.7,
    reviewCount: 180
  },
  {
    id: 'prod_7',
    slug: 'zenco-denim-jeans',
    name: 'Zenco Selvedge Denim Jeans',
    description: 'The definitive denim. Zenco Selvedge Jeans blend timeless style with modern comfort, crafted from premium Japanese denim for a fit that feels custom-made and ages beautifully.',
    category: 'Clothes',
    price: 189.99,
    brand: 'Zenco',
    images: [findImage('prod_img_7')],
    stock: 55,
    rating: 4.8,
    reviewCount: 240
  },
  {
    id: 'prod_8',
    slug: 'helios-loafers',
    name: 'Helios Venetian Loafers',
    description: 'Walk with unmatched confidence. The Helios Venetian Loafers embody effortless sophistication, crafted from the finest Italian leather to provide sublime comfort from the boardroom to the riviera.',
    category: 'Shoes',
    price: 295.00,
    brand: 'Helios',
    images: [findImage('prod_img_8')],
    stock: 38,
    rating: 4.9,
    reviewCount: 125
  },
  {
    id: 'prod_9',
    slug: 'nexa-phone-x1',
    name: 'Nexa-Phone X1 Pro',
    description: 'Experience tomorrow, today. The Nexa-Phone X1 Pro puts the future in your palm with its revolutionary edge-to-edge display and a cinematic-grade camera that captures life in breathtaking detail.',
    category: 'Phones',
    price: 1499.99,
    brand: 'Nexa',
    images: [findImage('prod_img_9')],
    stock: 28,
    rating: 4.9,
    reviewCount: 480
  },
  {
    id: 'prod_10',
    slug: 'aperture-blonde-wig',
    name: 'Aperture Sun-Kissed Blonde Wig',
    description: 'Instantly transform your style with the Aperture Sun-Kissed Wig. Expertly crafted from heat-resistant fibers, it offers a stunningly natural look and feel that’s sure to turn heads.',
    category: 'Wigs',
    price: 119.50,
    brand: 'Aperture',
    images: [findImage('prod_img_10')],
    stock: 18,
    rating: 4.7,
    reviewCount: 88
  },
  {
    id: 'prod_11',
    slug: 'stellar-evening-gown',
    name: 'Stellar Midnight Gala Gown',
    description: 'Command the night in the Stellar Midnight Gala Gown. An exquisite garment for life’s most memorable moments, its elegant silhouette and sparkling details ensure you are the center of every eye.',
    category: 'Clothes',
    price: 599.00,
    brand: 'Stellar',
    images: [findImage('prod_img_11')],
    stock: 11,
    rating: 5.0,
    reviewCount: 52
  },
  {
    id: 'prod_12',
    slug: 'orion-red-heels',
    name: 'Orion Scarlet Stiletto Heels',
    description: 'Ignite your look with the Orion Scarlet Stilettos. A statement of confidence and raw glamour, these heels are designed for maximum visual impact while providing surprising comfort.',
    category: 'Shoes',
    price: 249.99,
    brand: 'Orion',
    images: [findImage('prod_img_12')],
    stock: 33,
    rating: 4.8,
    reviewCount: 99
  },
  {
    id: 'prod_13',
    slug: 'nexa-silver-chain',
    name: 'Nexa Sterling Silver Herringbone Chain',
    description: 'Subtle elegance, perfected. The Nexa Sterling Herringbone Chain is a versatile and delicate masterpiece, perfect for adding a touch of refined class to both day and evening wear.',
    category: 'Chains',
    price: 375.00,
    brand: 'Nexa',
    images: [findImage('prod_img_13')],
    stock: 65,
    rating: 4.7,
    reviewCount: 140
  },
  {
    id: 'prod_14',
    slug: 'zenco-comfort-briefs',
    name: 'Zenco Cloud-Comfort Briefs',
    description: 'Experience a new realm of comfort with Zenco Cloud-Comfort Briefs. Made from exceptionally soft modal fabric, they provide all-day support and a barely-there feel.',
    category: 'Underwear',
    price: 115.00,
    brand: 'Zenco',
    images: [findImage('prod_img_14')],
    stock: 140,
    rating: 4.9,
    reviewCount: 275
  },
  {
    id: 'prod_15',
    slug: 'helios-brunette-wig',
    name: 'Helios Chestnut Brown Wig',
    description: 'Embrace a new you with the Helios Chestnut Wig. Featuring rich, multi-tonal color and a luxuriously soft texture, it provides a look of natural elegance and charm.',
    category: 'Wigs',
    price: 149.00,
    brand: 'Helios',
    images: [findImage('prod_img_15')],
    stock: 16,
    rating: 4.8,
    reviewCount: 82
  },
  {
    id: 'prod_16',
    slug: 'aperture-gaming-laptop',
    name: 'Aperture Predator Gaming Laptop',
    description: 'Conquer any virtual world with the Aperture Predator. Engineered for elite-level gaming, it features a 240Hz screen and blistering processing power for an immersive, zero-lag experience.',
    category: 'Laptops',
    price: 2599.99,
    brand: 'Aperture',
    images: [findImage('prod_img_16')],
    stock: 6,
    rating: 5.0,
    reviewCount: 165
  },
  {
    id: 'prod_17',
    slug: 'stellar-fleece-hoodie',
    name: 'Stellar Nimbus Fleece Hoodie',
    description: 'Wrap yourself in pure warmth with the Stellar Nimbus Hoodie. Incredibly soft and stylishly designed, it’s the perfect companion for cool evenings or relaxing in ultimate comfort.',
    category: 'Clothes',
    price: 145.00,
    brand: 'Stellar',
    images: [findImage('prod_img_17')],
    stock: 40,
    rating: 4.9,
    reviewCount: 195
  },
  {
    id: 'prod_18',
    slug: 'orion-classic-watch',
    name: 'Orion Heritage Classic Watch',
    description: 'Embrace tradition with the Orion Heritage Classic. A tribute to timeless horology and reliable mechanics, this watch is an essential, sophisticated accessory for any true enthusiast.',
    category: 'Watches',
    price: 1850.00,
    brand: 'Orion',
    images: [findImage('prod_img_18')],
    stock: 28,
    rating: 4.8,
    reviewCount: 130
  },
  {
    id: 'prod_19',
    slug: 'zenco-leather-boots',
    name: 'Zenco Ranger Leather Boots',
    description: 'Adventure calls with the Zenco Ranger Boots. Built for durability, style, and all-day comfort, these boots are ready to take you from urban jungles to rugged trails without missing a beat.',
    category: 'Shoes',
    price: 355.50,
    brand: 'Zenco',
    images: [findImage('prod_img_19')],
    stock: 23,
    rating: 4.8,
    reviewCount: 155
  },
  {
    id: 'prod_20',
    slug: 'helios-gold-chain',
    name: 'Helios Emperor Gold Chain',
    description: 'Exude sheer power and luxury with the Helios Emperor Chain. Meticulously crafted from solid gold for a bold feel, this piece is the ultimate statement of success and high fashion.',
    category: 'Chains',
    price: 1199.00,
    brand: 'Helios',
    images: [findImage('prod_img_20')],
    stock: 20,
    rating: 5.0,
    reviewCount: 92
  }
]
