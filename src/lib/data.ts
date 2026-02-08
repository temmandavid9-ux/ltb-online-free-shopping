import type { Product, Category } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { Shirt, Laptop, Watch, Headphones, Dna, Gamepad2, Dumbbell, Apple, CookingPot, Footprints, Layers } from 'lucide-react';

const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    return { url: 'https://placehold.co/600x600', hint: 'placeholder' };
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
  { id: 'cat7', name: 'Gadgets', icon: Headphones },
  { id: 'cat8', name: 'Gaming', icon: Gamepad2 },
  { id: 'cat9', name: 'Appliances', icon: CookingPot },
  { id: 'cat10', name: 'Groceries', icon: Apple },
  { id: 'cat11', name: 'Health', icon: Dumbbell },
];


export const brands: string[] = ['Zenco', 'Stellar', 'Nexa', 'Orion', 'Helios', 'iDino', 'Aperture'];

export const products: Product[] = [
  // Watches
  {
    id: 'prod_1',
    slug: 'stellar-gold-silver-watch',
    name: 'Stellar Gold & Silver Watch',
    description: 'A stylish and elegant gold and silver watch from Stellar. Perfect for any occasion, combining classic design with modern craftsmanship.',
    category: 'Watches',
    price: 85000,
    brand: 'Stellar',
    images: [findImage('prod_img_1')],
    stock: 25,
    rating: 4.8,
    reviewCount: 150
  },
  {
    id: 'prod_2',
    slug: 'nexa-smartwatch-v2',
    name: 'Nexa Smartwatch V2',
    description: 'Stay connected with the Nexa Smartwatch V2. Features a heart rate monitor, step tracker, and notifications, all in a sleek black design.',
    category: 'Watches',
    price: 120000,
    brand: 'Nexa',
    images: [findImage('prod_img_2')],
    stock: 40,
    rating: 4.6,
    reviewCount: 210
  },
  {
    id: 'prod_3',
    slug: 'orion-iced-out-cuban-chain',
    name: 'Orion Iced-Out Cuban Chain',
    description: 'Make a statement with this stunning moissanite diamond-studded cuban link chain from Orion. Unparalleled shine and quality.',
    category: 'Watches',
    price: 250000,
    brand: 'Orion',
    images: [findImage('prod_img_3')],
    stock: 15,
    rating: 4.9,
    reviewCount: 95
  },
  {
    id: 'prod_4',
    slug: 'helios-classic-leather-watch',
    name: 'Helios Classic Leather Watch',
    description: 'The Helios Classic features a timeless analog display with a genuine leather strap. A perfect blend of tradition and style.',
    category: 'Watches',
    price: 65000,
    brand: 'Helios',
    images: [findImage('prod_img_4')],
    stock: 50,
    rating: 4.7,
    reviewCount: 180
  },
  // Shoes
  {
    id: 'prod_5',
    slug: 'zenco-high-top-sneakers',
    name: 'Zenco High-Top Sneakers',
    description: 'Step up your shoe game with these stylish high-top sneakers from Zenco. Designed for comfort and urban style.',
    category: 'Shoes',
    price: 45000,
    brand: 'Zenco',
    images: [findImage('prod_img_5')],
    stock: 60,
    rating: 4.5,
    reviewCount: 250
  },
  {
    id: 'prod_6',
    slug: 'aperture-running-shoes',
    name: 'Aperture Running Shoes',
    description: 'Experience ultimate comfort and performance with the new running shoes from Aperture. Lightweight, breathable, and built for the long run.',
    category: 'Shoes',
    price: 55000,
    brand: 'Aperture',
    images: [findImage('prod_img_6')],
    stock: 70,
    rating: 4.8,
    reviewCount: 300
  },
  {
    id: 'prod_7',
    slug: 'stellar-classic-white-sneakers',
    name: 'Stellar Classic White Sneakers',
    description: 'A must-have in every wardrobe. The Stellar Classic White Sneakers are versatile, comfortable, and always in style.',
    category: 'Shoes',
    price: 38000,
    brand: 'Stellar',
    images: [findImage('prod_img_7')],
    stock: 100,
    rating: 4.7,
    reviewCount: 450
  },
  {
    id: 'prod_8',
    slug: 'nexa-athletic-shoes',
    name: 'Nexa Athletic Shoes',
    description: 'Push your limits with the Nexa athletic shoes. Featuring a bold black and red design with superior grip and cushioning.',
    category: 'Shoes',
    price: 48000,
    brand: 'Nexa',
    images: [findImage('prod_img_8')],
    stock: 45,
    rating: 4.6,
    reviewCount: 190
  },
  // Clothes
  {
    id: 'prod_9',
    slug: 'zenco-casual-t-shirt',
    name: 'Zenco Casual T-Shirt',
    description: 'A soft and comfortable casual t-shirt from Zenco, perfect for everyday wear. Made from 100% premium cotton.',
    category: 'Clothes',
    price: 15000,
    brand: 'Zenco',
    images: [findImage('prod_img_9')],
    stock: 120,
    rating: 4.9,
    reviewCount: 500
  },
  {
    id: 'prod_10',
    slug: 'orion-stylish-hoodie',
    name: 'Orion Stylish Hoodie',
    description: 'Stay warm and stylish with this premium hoodie from Orion. Features a soft inner lining and a modern fit.',
    category: 'Clothes',
    price: 32000,
    brand: 'Orion',
    images: [findImage('prod_img_10')],
    stock: 80,
    rating: 4.8,
    reviewCount: 280
  },
  {
    id: 'prod_11',
    slug: 'helios-formal-dress-shirt',
    name: 'Helios Formal Dress Shirt',
    description: 'Look sharp with the Helios formal dress shirt. Tailored for a perfect fit, it is ideal for business or formal events.',
    category: 'Clothes',
    price: 28000,
    brand: 'Helios',
    images: [findImage('prod_img_11')],
    stock: 65,
    rating: 4.7,
    reviewCount: 190
  },
  {
    id: 'prod_12',
    slug: 'aperture-denim-jeans',
    name: 'Aperture Denim Jeans',
    description: 'Classic five-pocket denim jeans from Aperture. Made with durable, comfortable stretch denim for a great fit all day long.',
    category: 'Clothes',
    price: 35000,
    brand: 'Aperture',
    images: [findImage('prod_img_12')],
    stock: 90,
    rating: 4.6,
    reviewCount: 320
  },
  // Laptops
  {
    id: 'prod_13',
    slug: 'idino-silver-stream-laptop',
    name: 'iDino Silver Stream Laptop',
    description: 'The iDino Silver Stream is a sleek and modern laptop designed for productivity and portability. Features a brilliant display and long battery life.',
    category: 'Laptops',
    price: 450000,
    brand: 'iDino',
    images: [findImage('prod_img_13')],
    stock: 30,
    rating: 4.7,
    reviewCount: 110
  },
  {
    id: 'prod_14',
    slug: 'nexa-onyx-book-pro',
    name: 'Nexa Onyx Book Pro',
    description: 'Powerful and professional, the Nexa Onyx Book Pro is built for creators and developers. Top-tier performance in a sleek black chassis.',
    category: 'Laptops',
    price: 750000,
    brand: 'Nexa',
    images: [findImage('prod_img_14')],
    stock: 20,
    rating: 4.9,
    reviewCount: 80
  },
  {
    id: 'prod_15',
    slug: 'stellar-air-ultrabook',
    name: 'Stellar Air Ultrabook',
    description: 'Incredibly thin and light, the Stellar Air is the perfect ultrabook for those on the go. Dont compromise on power or portability.',
    category: 'Laptops',
    price: 550000,
    brand: 'Stellar',
    images: [findImage('prod_img_15')],
    stock: 35,
    rating: 4.8,
    reviewCount: 130
  },
  {
    id: 'prod_16',
    slug: 'orion-blade-gaming-laptop',
    name: 'Orion Blade Gaming Laptop',
    description: 'Unleash your gaming potential with the Orion Blade. Featuring a high-refresh-rate screen and the latest graphics card for an immersive experience.',
    category: 'Laptops',
    price: 950000,
    brand: 'Orion',
    images: [findImage('prod_img_16')],
    stock: 18,
    rating: 4.9,
    reviewCount: 150
  },
  // Wigs
  {
    id: 'prod_17',
    slug: 'zenco-long-brown-wig',
    name: 'Zenco Long Brown Wig',
    description: 'Achieve a stunning new look with this beautiful long brown wig from Zenco. Made from high-quality synthetic fibers for a natural look and feel.',
    category: 'Wigs',
    price: 25000,
    brand: 'Zenco',
    images: [findImage('prod_img_17')],
    stock: 40,
    rating: 4.5,
    reviewCount: 80
  },
  {
    id: 'prod_18',
    slug: 'stellar-short-blonde-wig',
    name: 'Stellar Short Blonde Wig',
    description: 'A chic and stylish short blonde wig from Stellar. Easy to wear and maintain, perfect for a bold fashion statement.',
    category: 'Wigs',
    price: 22000,
    brand: 'Stellar',
    images: [findImage('prod_img_18')],
    stock: 50,
    rating: 4.6,
    reviewCount: 95
  },
  {
    id: 'prod_19',
    slug: 'nexa-curly-black-wig',
    name: 'Nexa Curly Black Wig',
    description: 'Embrace natural-looking curls with this voluminous black wig from Nexa. Features a comfortable cap for all-day wear.',
    category: 'Wigs',
    price: 28000,
    brand: 'Nexa',
    images: [findImage('prod_img_19')],
    stock: 35,
    rating: 4.7,
    reviewCount: 110
  },
  {
    id: 'prod_20',
    slug: 'orion-vibrant-red-wig',
    name: 'Orion Vibrant Red Wig',
    description: 'Turn heads with the Orion vibrant red wig. High-quality, heat-resistant fibers allow for versatile styling.',
    category: 'Wigs',
    price: 30000,
    brand: 'Orion',
    images: [findImage('prod_img_20')],
    stock: 30,
    rating: 4.8,
    reviewCount: 70
  },
  // Underwear
  {
    id: 'prod_21',
    slug: 'helios-boxer-briefs-3-pack',
    name: 'Helios Boxer Briefs (3-Pack)',
    description: 'A 3-pack of comfortable and supportive boxer briefs from Helios. Made with a soft, breathable cotton blend.',
    category: 'Underwear',
    price: 18000,
    brand: 'Helios',
    images: [findImage('prod_img_21')],
    stock: 200,
    rating: 4.9,
    reviewCount: 600
  },
  {
    id: 'prod_22',
    slug: 'aperture-cotton-trunks',
    name: 'Aperture Cotton Trunks',
    description: 'Experience all-day comfort with Aperture cotton trunks. Designed with a modern fit and a comfortable waistband.',
    category: 'Underwear',
    price: 7000,
    brand: 'Aperture',
    images: [findImage('prod_img_22')],
    stock: 150,
    rating: 4.8,
    reviewCount: 450
  },
  {
    id: 'prod_23',
    slug: 'stellar-lace-underwear-set',
    name: 'Stellar Lace Underwear Set',
    description: 'A beautiful and delicate lace underwear set from Stellar. Combines elegance with comfort for a luxurious feel.',
    category: 'Underwear',
    price: 12000,
    brand: 'Stellar',
    images: [findImage('prod_img_23')],
    stock: 80,
    rating: 4.7,
    reviewCount: 220
  },
  {
    id: 'prod_24',
    slug: 'zenco-microfiber-briefs',
    name: 'Zenco Microfiber Briefs',
    description: 'Ultra-soft and smooth microfiber briefs from Zenco. Provides a sleek fit and feels great against the skin.',
    category: 'Underwear',
    price: 6500,
    brand: 'Zenco',
    images: [findImage('prod_img_24')],
    stock: 180,
    rating: 4.8,
    reviewCount: 380
  },
  {
    id: 'prod_25',
    slug: 'nexa-gaming-chair',
    name: 'Nexa Ergonomic Gaming Chair',
    description: 'Game in comfort and style with the Nexa gaming chair. Fully adjustable with lumbar support.',
    category: 'Gaming',
    price: 150000,
    brand: 'Nexa',
    images: [findImage('prod_img_25')],
    stock: 50,
    rating: 4.9,
    reviewCount: 180
  },
  {
    id: 'prod_26',
    slug: 'orion-pro-gaming-headset',
    name: 'Orion Pro Gaming Headset',
    description: 'Immersive sound and crystal-clear communication with the Orion Pro headset.',
    category: 'Gaming',
    price: 65000,
    brand: 'Orion',
    images: [findImage('prod_img_26')],
    stock: 75,
    rating: 4.7,
    reviewCount: 220
  },
  {
    id: 'prod_27',
    slug: 'zenco-mechanical-keyboard',
    name: 'Zenco Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard for the ultimate gaming experience.',
    category: 'Gaming',
    price: 80000,
    brand: 'Zenco',
    images: [findImage('prod_img_27')],
    stock: 60,
    rating: 4.8,
    reviewCount: 190
  },
  {
    id: 'prod_28',
    slug: 'helios-fitness-tracker',
    name: 'Helios Fitness Tracker',
    description: 'Track your steps, heart rate, and workouts with the sleek Helios fitness band.',
    category: 'Health',
    price: 45000,
    brand: 'Helios',
    images: [findImage('prod_img_28')],
    stock: 110,
    rating: 4.6,
    reviewCount: 350
  },
  {
    id: 'prod_29',
    slug: 'aperture-power-blender',
    name: 'Aperture Power Blender',
    description: 'High-speed blender perfect for smoothies, soups, and more. A kitchen essential.',
    category: 'Appliances',
    price: 55000,
    brand: 'Aperture',
    images: [findImage('prod_img_29')],
    stock: 90,
    rating: 4.9,
    reviewCount: 400
  },
  {
    id: 'prod_30',
    slug: 'stellar-denim-jacket',
    name: 'Stellar Denim Jacket',
    description: 'A timeless denim jacket from Stellar. Perfect for layering in any season.',
    category: 'Clothes',
    price: 48000,
    brand: 'Stellar',
    images: [findImage('prod_img_30')],
    stock: 70,
    rating: 4.8,
    reviewCount: 310
  }
];
