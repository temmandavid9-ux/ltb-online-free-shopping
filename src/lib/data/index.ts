import type { Product, Category } from '../types';
import { Shirt, Laptop, Watch, Dna, Footprints, Layers, Smartphone, Link as LinkIcon, Palette } from 'lucide-react';
import { beautyProducts } from './beauty';
import { chainProducts } from './chains';
import { clothesProducts } from './clothes';
import { laptopProducts } from './laptops';
import { phoneProducts } from './phones';
import { shoeProducts } from './shoes';
import { underwearProducts } from './underwear';
import { watchProducts } from './watches';
import { wigProducts } from './wigs';
import { newProducts } from './new-products';

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
    ...watchProducts,
    ...laptopProducts,
    ...clothesProducts,
    ...shoeProducts,
    ...phoneProducts,
    ...wigProducts,
    ...chainProducts,
    ...underwearProducts,
    ...beautyProducts,
    ...newProducts,
];
