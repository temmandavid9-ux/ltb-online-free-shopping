
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
  {
    id: 'prod_1',
    slug: 'luxury-gold-watch-1',
    name: 'Luxury Gold Watch',
    description: 'A stunning gold watch that exudes elegance and style. A timeless piece for any collection.',
    category: 'Watches',
    price: 75000,
    brand: 'Helios',
    images: [{ url: findImage('prod_img_1').url, hint: findImage('prod_img_1').hint }],
    stock: 25,
    rating: 4.8,
    reviewCount: 120
  },
  {
    id: 'prod_2',
    slug: 'classic-leather-strap-watch-2',
    name: 'Classic Leather Strap Watch',
    description: 'Featuring a genuine leather strap and a classic face, this watch is perfect for everyday wear.',
    category: 'Watches',
    price: 45000,
    brand: 'Orion',
    images: [{ url: findImage('prod_img_2').url, hint: findImage('prod_img_2').hint }],
    stock: 40,
    rating: 4.6,
    reviewCount: 95
  },
  {
    id: 'prod_3',
    slug: 'ultrabook-pro-x1-3',
    name: 'Ultrabook Pro X1',
    description: 'Sleek, powerful, and lightweight. The Ultrabook Pro X1 is your perfect companion for work and travel.',
    category: 'Laptops',
    price: 120000,
    brand: 'Nexa',
    images: [{ url: findImage('prod_img_3').url, hint: findImage('prod_img_3').hint }],
    stock: 15,
    rating: 4.9,
    reviewCount: 250
  },
  {
    id: 'prod_4',
    slug: 'gaming-laptop-g-force-4',
    name: 'Gaming Laptop G-Force',
    description: 'Experience unparalleled gaming performance with the G-Force gaming laptop, featuring a high-refresh-rate screen and a powerful GPU.',
    category: 'Laptops',
    price: 180000,
    brand: 'Aperture',
    images: [{ url: findImage('prod_img_4').url, hint: findImage('prod_img_4').hint }],
    stock: 10,
    rating: 4.7,
    reviewCount: 180
  },
  {
    id: 'prod_5',
    slug: 'minimalist-silver-watch-5',
    name: 'Minimalist Silver Watch',
    description: 'A modern and minimalist watch with a clean silver finish. Perfect for the contemporary individual.',
    category: 'Watches',
    price: 55000,
    brand: 'Zenco',
    images: [{ url: findImage('prod_img_5').url, hint: findImage('prod_img_5').hint }],
    stock: 50,
    rating: 4.5,
    reviewCount: 75
  },
  {
    id: 'prod_6',
    slug: 'running-shoes-sprint-6',
    name: 'Running Shoes Sprint',
    description: 'Lightweight and comfortable, the Sprint running shoes are designed for speed and performance.',
    category: 'Shoes',
    price: 35000,
    brand: 'Stellar',
    images: [{ url: findImage('prod_img_6').url, hint: findImage('prod_img_6').hint }],
    stock: 80,
    rating: 4.4,
    reviewCount: 210
  },
  {
    id: 'prod_7',
    slug: 'leather-boots-classic-7',
    name: 'Leather Boots Classic',
    description: 'Durable and stylish, these classic leather boots are a wardrobe essential.',
    category: 'Shoes',
    price: 65000,
    brand: 'Orion',
    images: [{ url: findImage('prod_img_7').url, hint: findImage('prod_img_7').hint }],
    stock: 30,
    rating: 4.7,
    reviewCount: 150
  },
  {
    id: 'prod_8',
    slug: 'long-silky-wig-8',
    name: 'Long Silky Wig',
    description: 'Transform your look with this long, silky, and natural-looking wig. Made from high-quality synthetic fibers.',
    category: 'Wigs',
    price: 25000,
    brand: 'Nexa',
    images: [{ url: findImage('prod_img_8').url, hint: findImage('prod_img_8').hint }],
    stock: 60,
    rating: 4.3,
    reviewCount: 85
  },
  {
    id: 'prod_9',
    slug: 'curly-bob-wig-9',
    name: 'Curly Bob Wig',
    description: 'A chic and playful curly bob wig that adds volume and personality to your style.',
    category: 'Wigs',
    price: 22000,
    brand: 'Zenco',
    images: [{ url: findImage('prod_img_9').url, hint: findImage('prod_img_9').hint }],
    stock: 70,
    rating: 4.6,
    reviewCount: 110
  },
  {
    id: 'prod_10',
    slug: 'casual-t-shirt-10',
    name: 'Casual T-Shirt',
    description: 'A comfortable and versatile t-shirt made from 100% cotton. A staple for any casual outfit.',
    category: 'Clothes',
    price: 8000,
    brand: 'Stellar',
    images: [{ url: findImage('prod_img_10').url, hint: findImage('prod_img_10').hint }],
    stock: 150,
    rating: 4.5,
    reviewCount: 300
  },
  {
    id: 'prod_11',
    slug: 'denim-jacket-classic-11',
    name: 'Denim Jacket Classic',
    description: 'A timeless denim jacket that never goes out of style. Perfect for layering.',
    category: 'Clothes',
    price: 28000,
    brand: 'Orion',
    images: [{ url: findImage('prod_img_11').url, hint: findImage('prod_img_11').hint }],
    stock: 45,
    rating: 4.8,
    reviewCount: 180
  },
  {
    id: 'prod_12',
    slug: 'slim-fit-chinos-12',
    name: 'Slim Fit Chinos',
    description: 'Modern and stylish slim-fit chinos, perfect for both casual and semi-formal occasions.',
    category: 'Clothes',
    price: 18000,
    brand: 'Helios',
    images: [{ url: findImage('prod_img_12').url, hint: findImage('prod_img_12').hint }],
    stock: 90,
    rating: 4.6,
    reviewCount: 130
  },
  {
    id: 'prod_13',
    slug: 'hoodie-comfort-13',
    name: 'Hoodie Comfort',
    description: 'Stay warm and comfortable with this soft and cozy hoodie. Ideal for a relaxed day.',
    category: 'Clothes',
    price: 22000,
    brand: 'Nexa',
    images: [{ url: findImage('prod_img_13').url, hint: findImage('prod_img_13').hint }],
    stock: 110,
    rating: 4.7,
    reviewCount: 220
  },
  {
    id: 'prod_14',
    slug: 'boxer-briefs-3-pack-14',
    name: 'Boxer Briefs (3-Pack)',
    description: 'A pack of three comfortable and breathable boxer briefs made from a soft cotton blend.',
    category: 'Underwear',
    price: 9000,
    brand: 'Zenco',
    images: [{ url: findImage('prod_img_14').url, hint: findImage('prod_img_14').hint }],
    stock: 200,
    rating: 4.9,
    reviewCount: 400
  },
  {
    id: 'prod_15',
    slug: 'lace-bralette-15',
    name: 'Lace Bralette',
    description: 'A delicate and beautiful lace bralette that offers comfort without compromising on style.',
    category: 'Underwear',
    price: 7000,
    brand: 'Stellar',
    images: [{ url: findImage('prod_img_15').url, hint: findImage('prod_img_15').hint }],
    stock: 120,
    rating: 4.8,
    reviewCount: 150
  },
  {
    id: 'prod_16',
    slug: 'sports-chronograph-watch-16',
    name: 'Sports Chronograph Watch',
    description: 'A durable and functional sports watch with chronograph features, perfect for the active individual.',
    category: 'Watches',
    price: 85000,
    brand: 'Aperture',
    images: [{ url: findImage('prod_img_16').url, hint: findImage('prod_img_16').hint }],
    stock: 20,
    rating: 4.7,
    reviewCount: 90
  },
  {
    id: 'prod_17',
    slug: 'smart-watch-connect-17',
    name: 'Smart Watch Connect',
    description: 'Stay connected with notifications, fitness tracking, and more with this feature-packed smart watch.',
    category: 'Watches',
    price: 95000,
    brand: 'iDino',
    images: [{ url: findImage('prod_img_17').url, hint: findImage('prod_img_17').hint }],
    stock: 35,
    rating: 4.6,
    reviewCount: 200
  },
  {
    id: 'prod_18',
    slug: 'diver-pro-watch-18',
    name: 'Diver Pro Watch',
    description: 'Water-resistant up to 200 meters, the Diver Pro is a reliable timepiece for aquatic adventures.',
    category: 'Watches',
    price: 110000,
    brand: 'Orion',
    images: [{ url: findImage('prod_img_18').url, hint: findImage('prod_img_18').hint }],
    stock: 18,
    rating: 4.9,
    reviewCount: 130
  },
  {
    id: 'prod_19',
    slug: 'casual-sneakers-19',
    name: 'Casual Sneakers',
    description: 'Stylish and comfortable sneakers for everyday wear. Pairs well with any casual outfit.',
    category: 'Shoes',
    price: 28000,
    brand: 'Helios',
    images: [{ url: findImage('prod_img_19').url, hint: findImage('prod_img_19').hint }],
    stock: 100,
    rating: 4.5,
    reviewCount: 250
  },
  {
    id: 'prod_20',
    slug: 'formal-oxford-shoes-20',
    name: 'Formal Oxford Shoes',
    description: 'Classic oxford shoes made from genuine leather. The perfect choice for formal occasions.',
    category: 'Shoes',
    price: 52000,
    brand: 'Nexa',
    images: [{ url: findImage('prod_img_20').url, hint: findImage('prod_img_20').hint }],
    stock: 55,
    rating: 4.8,
    reviewCount: 190
  },
  {
    id: 'prod_21',
    slug: 'iced-out-chain-watch-21',
    name: 'Iced Out Chain Watch',
    description: 'Make a bold statement with this iced-out chain watch, featuring sparkling simulated diamonds.',
    category: 'Watches',
    price: 150000,
    brand: 'Zenco',
    images: [{ url: findImage('prod_img_21').url, hint: findImage('prod_img_21').hint }],
    stock: 8,
    rating: 4.9,
    reviewCount: 88
  },
  {
    id: 'prod_22',
    slug: 'diamond-cuban-necklace-watch-22',
    name: 'Diamond Cuban Necklace Watch',
    description: 'A unique combination of a diamond cuban necklace and a watch. The ultimate luxury accessory.',
    category: 'Watches',
    price: 250000,
    brand: 'Helios',
    images: [{ url: findImage('prod_img_22').url, hint: findImage('prod_img_22').hint }],
    stock: 5,
    rating: 5.0,
    reviewCount: 50
  },
  {
    id: 'prod_23',
    slug: 'silver-chronograph-23',
    name: 'Silver Chronograph',
    description: 'A sophisticated silver chronograph watch that combines functionality with a sleek design.',
    category: 'Watches',
    price: 98000,
    brand: 'Orion',
    images: [{ url: findImage('prod_img_23').url, hint: findImage('prod_img_23').hint }],
    stock: 22,
    rating: 4.7,
    reviewCount: 115
  },
  {
    id: 'prod_24',
    slug: 'rose-gold-elegance-watch-24',
    name: 'Rose Gold Elegance Watch',
    description: 'This beautiful rose gold watch is the epitome of elegance and grace. A perfect gift.',
    category: 'Watches',
    price: 82000,
    brand: 'Stellar',
    images: [{ url: findImage('prod_img_24').url, hint: findImage('prod_img_24').hint }],
    stock: 33,
    rating: 4.8,
    reviewCount: 99
  }
];
