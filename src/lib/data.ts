
import type { Product, Category } from './types';
import { Shirt, Laptop, Watch, Dna, Footprints, Layers, Smartphone, Link as LinkIcon, Palette } from 'lucide-react';
import { newProducts } from './data/new-products';

/**
 * Master Category Configuration
 */
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

/**
 * Master Product Catalog
 * composited EXCLUSIVELY from the dynamic newProducts engine.
 * This ensures NO REPETITION and 100% utilization of your 900+ assets.
 */
export const products: Product[] = [
    ...newProducts
];

export const brands: string[] = Array.from(new Set(products.map(p => p.brand)));
