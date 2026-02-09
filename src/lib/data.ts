
import type { Product, Category } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { Shirt, Laptop, Watch, Dna, Footprints, Layers, Smartphone, Link as LinkIcon } from 'lucide-react';

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
];

export const brands: string[] = ['Zenco', 'Stellar', 'Nexa', 'Orion', 'Helios', 'iDino', 'Aperture'];

export const products: Product[] = [
  {
    id: 'prod_1',
    slug: 'product-1',
    name: 'Stylish Shirt',
    description: 'A brand new high-quality item from our latest collection. Available for redemption now.',
    category: 'Clothes',
    price: 115637,
    brand: 'Aperture',
    images: [{ url: findImage('prod_img_1').url, hint: findImage('prod_img_1').hint }],
    stock: 32,
    rating: 4.3,
    reviewCount: 466
  },
  {
    id: 'prod_2',
    slug: 'product-2',
    name: 'Luxury Wig',
    description: 'A brand new high-quality item from our latest collection. Available for redemption now.',
    category: 'Wigs',
    price: 64809,
    brand: 'Stellar',
    images: [{ url: findImage('prod_img_2').url, hint: findImage('prod_img_2').hint }],
    stock: 147,
    rating: 4.1,
    reviewCount: 398
  },
  {
    id: 'prod_3',
    slug: 'product-3',
    name: 'Modern Laptop',
    description: 'A brand new high-quality item from our latest collection. Available for redemption now.',
    category: 'Laptops',
    price: 147883,
    brand: 'Nexa',
    images: [{ url: findImage('prod_img_3').url, hint: findImage('prod_img_3').hint }],
    stock: 18,
    rating: 4.2,
    reviewCount: 226
  },
  {
    id: 'prod_4',
    slug: 'product-4',
    name: 'Running Shoes',
    description: 'A brand new high-quality item from our latest collection. Available for redemption now.',
    category: 'Shoes',
    price: 19688,
    brand: 'Orion',
    images: [{ url: findImage('prod_img_4').url, hint: findImage('prod_img_4').hint }],
    stock: 122,
    rating: 4.0,
    reviewCount: 231
  },
  {
    id: 'prod_5',
    slug: 'product-5',
    name: 'Elegant Watch',
    description: 'A brand new high-quality item from our latest collection. Available for redemption now.',
    category: 'Watches',
    price: 167556,
    brand: 'Zenco',
    images: [{ url: findImage('prod_img_5').url, hint: findImage('prod_img_5').hint }],
    stock: 153,
    rating: 4.5,
    reviewCount: 423
  },
  {
    id: 'prod_6',
    slug: 'product-6',
    name: 'Comfortable Underwear',
    description: 'A brand new high-quality item from our latest collection. Available for redemption now.',
    category: 'Underwear',
    price: 153289,
    brand: 'iDino',
    images: [{ url: findImage('prod_img_6').url, hint: findImage('prod_img_6').hint }],
    stock: 75,
    rating: 4.6,
    reviewCount: 169
  },
  {
    id: 'prod_7',
    slug: 'product-7',
    name: 'Diamond Cuban Necklace',
    description: 'A brand new high-quality item from our latest collection. Available for redemption now.',
    category: 'Chains',
    price: 118431,
    brand: 'Zenco',
    images: [{ url: findImage('prod_img_7').url, hint: findImage('prod_img_7').hint }],
    stock: 33,
    rating: 4.3,
    reviewCount: 337
  },
  {
    id: 'prod_8',
    slug: 'product-8',
    name: 'Latest Smartphone',
    description: 'A brand new high-quality item from our latest collection. Available for redemption now.',
    category: 'Phones',
    price: 182390,
    brand: 'Aperture',
    images: [{ url: findImage('prod_img_8').url, hint: findImage('prod_img_8').hint }],
    stock: 111,
    rating: 4.1,
    reviewCount: 184
  }
];
