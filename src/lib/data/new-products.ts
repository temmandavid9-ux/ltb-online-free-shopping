
import type { Product } from '../types';
import { findImage } from './find-image';

export const newProducts: Product[] = [
  {
    id: 'prod_f1',
    slug: 'prestige-foundation-item',
    name: 'Prestige Legacy Foundation',
    description: 'A masterpiece of precision and refined aesthetics from our primary Prestige Collection.',
    category: 'Beauty',
    price: 450,
    brand: 'Nexa',
    images: [findImage('prod_img_1')],
    stock: 10,
    rating: 5.0,
    reviewCount: 85
  },
  {
    id: 'prod_f2',
    slug: 'elite-foundation-item',
    name: 'Elite Zenith Series',
    description: 'Crafted for the elite echelon, providing unmatched quality and presence.',
    category: 'Beauty',
    price: 320,
    brand: 'Stellar',
    images: [findImage('prod_img_2')],
    stock: 15,
    rating: 4.9,
    reviewCount: 64
  },
  {
    id: 'prod_f3',
    slug: 'signature-foundation-item',
    name: 'Signature Standard Piece',
    description: 'The definitive standard for Eden 0² aesthetics and professional quality.',
    category: 'Beauty',
    price: 280,
    brand: 'Zenco',
    images: [findImage('prod_img_3')],
    stock: 20,
    rating: 4.8,
    reviewCount: 92
  },
  {
    id: 'prod_f4',
    slug: 'ultimate-foundation-item',
    name: 'Ultimate Quality Piece',
    description: 'Unmatched quality and presence from our Ultimate Collection.',
    category: 'Beauty',
    price: 350,
    brand: 'Aperture',
    images: [findImage('prod_img_4')],
    stock: 12,
    rating: 4.9,
    reviewCount: 75
  },
  {
    id: 'prod_f5',
    slug: 'legacy-foundation-item',
    name: 'Legacy Master Edition',
    description: 'Inherit the style of masters with this exclusive high-end piece.',
    category: 'Beauty',
    price: 295,
    brand: 'Helios',
    images: [findImage('prod_img_5')],
    stock: 18,
    rating: 4.8,
    reviewCount: 61
  },
  {
    id: 'prod_f6',
    slug: 'heritage-foundation-item',
    name: 'Heritage Perfection Series',
    description: 'Time-honored perfection for the most discerning catalog.',
    category: 'Beauty',
    price: 310,
    brand: 'iDino',
    images: [findImage('prod_img_6')],
    stock: 14,
    rating: 4.9,
    reviewCount: 52
  },
  {
    id: 'prod_f7',
    slug: 'prime-foundation-item',
    name: 'Prime Elegance Standard',
    description: 'The core of modern elegance and visual sophistication.',
    category: 'Beauty',
    price: 275,
    brand: 'Stellar',
    images: [findImage('prod_img_7')],
    stock: 22,
    rating: 4.8,
    reviewCount: 88
  },
  {
    id: 'prod_f8',
    slug: 'royal-foundation-item',
    name: 'Royal Echelon Edition',
    description: 'Fit for the elite echelon of our global collection.',
    category: 'Beauty',
    price: 380,
    brand: 'Orion',
    images: [findImage('prod_img_8')],
    stock: 9,
    rating: 5.0,
    reviewCount: 43
  },
  {
    id: 'prod_f9',
    slug: 'vertex-foundation-item',
    name: 'Vertex Curve Series',
    description: 'At the top of the design curve with unmatched precision.',
    category: 'Beauty',
    price: 340,
    brand: 'Nexa',
    images: [findImage('prod_img_9')],
    stock: 16,
    rating: 4.9,
    reviewCount: 67
  },
  {
    id: 'prod_f10',
    slug: 'apex-foundation-item',
    name: 'Apex Heights Edition',
    description: 'Reaching the highest heights of product quality.',
    category: 'Beauty',
    price: 410,
    brand: 'Zenco',
    images: [findImage('prod_img_10')],
    stock: 11,
    rating: 5.0,
    reviewCount: 59
  },
  {
    id: 'prod_f11',
    slug: 'core-foundation-item',
    name: 'Core Experience Piece',
    description: 'The fundamental Eden experience in every detail.',
    category: 'Beauty',
    price: 260,
    brand: 'Aperture',
    images: [findImage('prod_img_11')],
    stock: 25,
    rating: 4.8,
    reviewCount: 94
  }
];
