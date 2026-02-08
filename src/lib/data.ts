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

export const products: Product[] = [];
