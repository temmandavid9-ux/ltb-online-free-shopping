import type { Product } from '../types';
import { findImage } from './find-image';

/**
 * Standard Beauty Catalog.
 * Consolidated brands to LTB Brand.
 */
export const beautyProducts: Product[] = [
  {
    id: 'prod_1',
    slug: 'product-1',
    name: 'LTB Brand Radiant Foundation',
    description: 'The definitive standard of flawless coverage.',
    category: 'Beauty',
    price: 45,
    brand: 'LTB Brand',
    images: [findImage('prod_img_1')],
    stock: 100,
    rating: 4.8,
    reviewCount: 320,
  },
  {
    id: 'prod_2',
    slug: 'product-2',
    name: 'LTB Brand Glow Serum',
    description: 'Zenith of skin refinement.',
    category: 'Beauty',
    price: 75,
    brand: 'LTB Brand',
    images: [findImage('prod_img_2')],
    stock: 80,
    rating: 4.9,
    reviewCount: 450,
  },
  {
    id: 'prod_3',
    slug: 'product-3',
    name: 'LTB Brand Lip Lacquer Set',
    description: 'Signature aesthetics for the global elite.',
    category: 'Beauty',
    price: 50,
    brand: 'LTB Brand',
    images: [findImage('prod_img_3')],
    stock: 120,
    rating: 4.7,
    reviewCount: 280,
  },
  {
    id: 'prod_4',
    slug: 'product-4',
    name: 'LTB Brand Flawless Finish',
    description: 'Ultimate quality verified by Less Talk Business.',
    category: 'Beauty',
    price: 48,
    brand: 'LTB Brand',
    images: [findImage('prod_img_4')],
    stock: 90,
    rating: 4.8,
    reviewCount: 310,
  }
];
