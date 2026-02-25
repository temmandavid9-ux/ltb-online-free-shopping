
import type { Product } from '../types';
import { findImage } from './find-image';

const generateBatch = (start: number, end: number, category: string = 'Beauty', baseName: string = 'Exclusive Arrival'): Product[] => {
  const batch: Product[] = [];
  for (let i = start; i <= end; i++) {
    batch.push({
      id: `prod_exclusive_${i}`,
      slug: `exclusive-arrival-${i}`,
      name: `${baseName} #${i}`,
      description: `An elite-tier masterwork from the Eden 0² registry. This item represents the zenith of craftsmanship and verified exclusivity. Unique code: ${i}.`,
      category: category,
      price: Math.floor(Math.random() * (1200 - 150 + 1)) + 150,
      brand: ['Nexa', 'Stellar', 'Aperture', 'Helios', 'Zenco'][Math.floor(Math.random() * 5)],
      images: [findImage(`prod_img_${i}`)],
      stock: Math.floor(Math.random() * 20) + 5,
      rating: 4.8 + Math.random() * 0.2,
      reviewCount: Math.floor(Math.random() * 150) + 50
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
    images: [findImage('prod_img_1')],
    stock: 10,
    rating: 5.0,
    reviewCount: 85
  },
  ...generateBatch(411, 424, 'Clothes', 'Executive Collection'),
  ...generateBatch(425, 450, 'Beauty', 'Premium Selection'),
  ...generateBatch(451, 477, 'Clothes', 'Performance Elite'),
  ...generateBatch(478, 504, 'Watches', 'Lifestyle Master'),
  ...generateBatch(505, 528, 'Chains', 'Curated Luxury'),
  ...generateBatch(529, 553, 'Wigs', 'Signature Piece'),
  ...generateBatch(554, 576, 'Beauty', 'Heritage Elite'),
  ...generateBatch(577, 604, 'Beauty', 'Supreme Executive'),
  ...generateBatch(605, 631, 'Beauty', 'Elite Curated')
];
