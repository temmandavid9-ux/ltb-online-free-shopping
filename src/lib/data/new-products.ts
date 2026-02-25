
import type { Product } from '../types';
import { findImage } from './find-image';

const generateBatch = (start: number, end: number): Product[] => {
  const batch: Product[] = [];
  for (let i = start; i <= end; i++) {
    batch.push({
      id: `prod_exclusive_${i}`,
      slug: `exclusive-arrival-${i}`,
      name: `Premium Selection #${i}`,
      description: `A brand new exclusive item offering superior quality and unmatched style from the Eden 0² registry. Product unique identification code: ${i}.`,
      category: 'Beauty',
      price: Math.floor(Math.random() * (500 - 150 + 1)) + 150,
      brand: ['Nexa', 'Stellar', 'Aperture', 'Helios', 'Zenco'][Math.floor(Math.random() * 5)],
      images: [findImage(`prod_img_${i}`)],
      stock: Math.floor(Math.random() * 30) + 5,
      rating: 4.7 + Math.random() * 0.3,
      reviewCount: Math.floor(Math.random() * 100) + 10
    });
  }
  return batch;
};

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
  ...generateBatch(411, 424),
  ...generateBatch(425, 450),
  ...generateBatch(451, 477),
  ...generateBatch(478, 504),
  ...generateBatch(505, 528),
  ...generateBatch(529, 553)
];
