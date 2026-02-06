import type { Product, Category } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { Shirt, Laptop, BookOpen, Watch, Sofa, Headphones, Coffee, Backpack, Dna, Gamepad2 } from 'lucide-react';

const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    return { url: 'https://placehold.co/600x600', hint: 'placeholder' };
  }
  return { url: image.imageUrl, hint: image.imageHint };
};

export const categories: Category[] = [
  { id: 'cat1', name: 'Apparel', icon: Shirt },
  { id: 'cat2', name: 'Electronics', icon: Laptop },
  { id: 'cat3', name: 'Books', icon: BookOpen },
  { id: 'cat4', name: 'Accessories', icon: Watch },
  { id: 'cat5', name: 'Home Goods', icon: Sofa },
];

export const brands: string[] = ['Apex', 'Stellar', 'Nova', 'Orion', 'Helios'];

export const products: Product[] = [
  {
    id: 'prod_1',
    slug: 'modern-fit-tee',
    name: 'Modern-Fit Tee',
    description: 'A perfect blend of comfort and style, this modern-fit t-shirt is a wardrobe essential. Made from 100% premium cotton.',
    category: 'Apparel',
    price: 29.99,
    brand: 'Apex',
    images: [findImage('prod_img_1'), findImage('prod_img_2')],
    stock: 150,
  },
  {
    id: 'prod_2',
    slug: 'ultrabook-pro-x',
    name: 'Ultrabook Pro X',
    description: 'Experience unparalleled performance with the Ultrabook Pro X. Featuring the latest generation processor, a stunning 4K display, and a sleek, lightweight design.',
    category: 'Electronics',
    price: 1299.99,
    brand: 'Stellar',
    images: [findImage('prod_img_3'), findImage('prod_img_4')],
    stock: 45,
  },
  {
    id: 'prod_3',
    slug: 'the-forgotten-path',
    name: 'The Forgotten Path',
    description: 'A thrilling fantasy novel that will transport you to a world of magic, mystery, and adventure. A must-read for fans of epic sagas.',
    category: 'Books',
    price: 19.99,
    brand: 'Nova',
    images: [findImage('prod_img_5'), findImage('prod_img_6')],
    stock: 200,
  },
  {
    id: 'prod_4',
    slug: 'chronograph-watch-classic',
    name: 'Chronograph Watch Classic',
    description: 'Timeless elegance meets modern functionality. This classic chronograph watch features a stainless steel case, leather strap, and precise quartz movement.',
    category: 'Accessories',
    price: 249.99,
    brand: 'Orion',
    images: [findImage('prod_img_7')],
    stock: 80,
  },
  {
    id: 'prod_5',
    slug: 'minimalist-lounge-sofa',
    name: 'Minimalist Lounge Sofa',
    description: 'Upgrade your living space with this minimalist lounge sofa. Designed for comfort and durability, with a clean aesthetic that complements any decor.',
    category: 'Home Goods',
    price: 899.99,
    brand: 'Helios',
    images: [findImage('prod_img_8'), findImage('prod_img_9')],
    stock: 25,
  },
    {
    id: 'prod_6',
    slug: 'noise-cancelling-headphones',
    name: 'Aura Wireless Headphones',
    description: 'Immerse yourself in pure sound with Aura Wireless Headphones. Featuring active noise cancellation and up to 30 hours of battery life.',
    category: 'Electronics',
    price: 199.99,
    brand: 'Stellar',
    images: [findImage('prod_img_10')],
    stock: 120,
  },
  {
    id: 'prod_7',
    slug: 'espresso-machine-pro',
    name: 'Espresso Machine Pro',
    description: 'Become your own barista with this professional-grade espresso machine. Perfect for crafting lattes, cappuccinos, and more.',
    category: 'Home Goods',
    price: 499.50,
    brand: 'Helios',
    images: [findImage('prod_img_11')],
    stock: 40,
  },
  {
    id: 'prod_8',
    slug: 'explorer-travel-backpack',
    name: 'Explorer Travel Backpack',
    description: 'The ultimate companion for your adventures. This backpack is durable, water-resistant, and features multiple compartments for all your gear.',
    category: 'Accessories',
    price: 89.99,
    brand: 'Apex',
    images: [findImage('prod_img_12')],
    stock: 95,
  },
  {
    id: 'prod_9',
    slug: 'classic-denim-jeans',
    name: 'Classic Denim Jeans',
    description: 'A timeless classic. These denim jeans offer a comfortable fit and a versatile look that never goes out of style.',
    category: 'Apparel',
    price: 79.99,
    brand: 'Apex',
    images: [findImage('prod_img_13')],
    stock: 180,
  },
  {
    id: 'prod_10',
    slug: 'velocity-running-sneakers',
    name: 'Velocity Running Sneakers',
    description: 'Achieve your personal best with the Velocity sneakers. Engineered for performance with lightweight cushioning and superior grip.',
    category: 'Apparel',
    price: 129.99,
    brand: 'Orion',
    images: [findImage('prod_img_14')],
    stock: 110,
  },
];
