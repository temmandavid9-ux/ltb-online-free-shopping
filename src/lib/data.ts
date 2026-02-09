
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

export const products: Product[] = [];
