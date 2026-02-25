
import type { Product } from '../types';
import { findImage } from './find-image';

export const newProducts: Product[] = [
  {
    id: 'prod_exclusive_400',
    slug: 'exclusive-arrival-400',
    name: 'Masterpiece Collection Piece 1',
    description: 'A brand new exclusive item offering superior quality and unmatched style from the 1,000-slot registry.',
    category: 'Beauty',
    price: 450,
    brand: 'Nexa',
    images: [findImage('prod_img_400')],
    stock: 10,
    rating: 5.0,
    reviewCount: 85
  },
  {
    id: 'prod_exclusive_401',
    slug: 'exclusive-arrival-401',
    name: 'Masterpiece Collection Piece 2',
    description: 'Exclusive arrival showcasing refined aesthetics and high-end materials.',
    category: 'Beauty',
    price: 320,
    brand: 'Stellar',
    images: [findImage('prod_img_401')],
    stock: 15,
    rating: 4.9,
    reviewCount: 64
  },
  {
    id: 'prod_exclusive_402',
    slug: 'exclusive-arrival-402',
    name: 'Masterpiece Collection Piece 3',
    description: 'Premium quality resource from the latest executive transmission.',
    category: 'Beauty',
    price: 280,
    brand: 'Zenco',
    images: [findImage('prod_img_402')],
    stock: 20,
    rating: 4.8,
    reviewCount: 92
  },
  {
    id: 'prod_exclusive_403',
    slug: 'exclusive-arrival-403',
    name: 'Masterpiece Collection Piece 4',
    description: 'High-definition verified asset now active in the production registry.',
    category: 'Beauty',
    price: 350,
    brand: 'Aperture',
    images: [findImage('prod_img_403')],
    stock: 12,
    rating: 4.9,
    reviewCount: 75
  },
  {
    id: 'prod_exclusive_404',
    slug: 'exclusive-arrival-404',
    name: 'Masterpiece Collection Piece 5',
    description: 'Distinctive visual identity powered by our expanded infrastructure.',
    category: 'Beauty',
    price: 295,
    brand: 'Helios',
    images: [findImage('prod_img_404')],
    stock: 18,
    rating: 4.8,
    reviewCount: 61
  },
  {
    id: 'prod_exclusive_405',
    slug: 'exclusive-arrival-405',
    name: 'Masterpiece Collection Piece 6',
    description: 'One of 410 unique verified assets, now fully integrated.',
    category: 'Beauty',
    price: 310,
    brand: 'iDino',
    images: [findImage('prod_img_405')],
    stock: 14,
    rating: 4.9,
    reviewCount: 52
  },
  {
    id: 'prod_exclusive_406',
    slug: 'exclusive-arrival-406',
    name: 'Masterpiece Collection Piece 7',
    description: 'A key component of the 1,000-slot asset registry expansion.',
    category: 'Beauty',
    price: 275,
    brand: 'Stellar',
    images: [findImage('prod_img_406')],
    stock: 22,
    rating: 4.8,
    reviewCount: 88
  },
  {
    id: 'prod_exclusive_407',
    slug: 'exclusive-arrival-407',
    name: 'Masterpiece Collection Piece 8',
    description: 'Verified resource live and verifiable in the Admin panel.',
    category: 'Beauty',
    price: 380,
    brand: 'Orion',
    images: [findImage('prod_img_407')],
    stock: 9,
    rating: 5.0,
    reviewCount: 43
  },
  {
    id: 'prod_exclusive_408',
    slug: 'exclusive-arrival-408',
    name: 'Masterpiece Collection Piece 9',
    description: 'Uniquely identified asset with zero visual redundancy.',
    category: 'Beauty',
    price: 340,
    brand: 'Nexa',
    images: [findImage('prod_img_408')],
    stock: 16,
    rating: 4.9,
    reviewCount: 67
  },
  {
    id: 'prod_exclusive_409',
    slug: 'exclusive-arrival-409',
    name: 'Masterpiece Collection Piece 10',
    description: 'Exclusive arrivals collection, ensuring 100% link utilization.',
    category: 'Beauty',
    price: 410,
    brand: 'Zenco',
    images: [findImage('prod_img_409')],
    stock: 11,
    rating: 5.0,
    reviewCount: 59
  },
  {
    id: 'prod_exclusive_410',
    slug: 'exclusive-arrival-410',
    name: 'Masterpiece Collection Piece 11',
    description: 'The final piece of the latest 410-item unique verification batch.',
    category: 'Beauty',
    price: 260,
    brand: 'Aperture',
    images: [findImage('prod_img_410')],
    stock: 25,
    rating: 4.8,
    reviewCount: 94
  }
];
