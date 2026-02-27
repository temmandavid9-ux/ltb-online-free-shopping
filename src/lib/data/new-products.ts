import type { Product } from '../types';
import { findImage } from './find-image';

const generateBatch = (start: number, end: number, category: string = 'Beauty', baseName: string = 'Exclusive Arrival'): Product[] => {
  const batch: Product[] = [];
  for (let i = start; i <= end; i++) {
    batch.push({
      id: `prod_exclusive_${i}`,
      slug: `exclusive-arrival-${i}`,
      name: `${baseName} #${i}`,
      description: `An elite-tier masterwork from the Less Talk Business registry. This item represents the zenith of craftsmanship and verified exclusivity. Unique code: LTB-EX-${i}.`,
      category: category,
      price: Math.floor(Math.random() * (1200 - 150 + 1)) + 150,
      brand: ['Nexa', 'Stellar', 'Aperture', 'Helios', 'Zenco'][Math.floor(Math.random() * 5)],
      images: [findImage(`prod_img_${i}`)],
      stock: Math.floor(Math.random() * 20) + 5,
      rating: Number((4.7 + Math.random() * 0.3).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 500) + 100
    });
  }
  return batch;
};

// CEO Expansion: Generating items to match the 900+ asset additions
export const newProducts: Product[] = [
  ...generateBatch(411, 450, 'Clothes', 'Executive Collection'),
  ...generateBatch(451, 500, 'Beauty', 'Premium Selection'),
  ...generateBatch(501, 550, 'Clothes', 'Performance Elite'),
  ...generateBatch(551, 600, 'Watches', 'Lifestyle Master'),
  ...generateBatch(601, 650, 'Chains', 'Curated Luxury'),
  ...generateBatch(651, 700, 'Wigs', 'Signature Piece'),
  ...generateBatch(701, 750, 'Beauty', 'Heritage Elite'),
  ...generateBatch(751, 800, 'Beauty', 'Supreme Executive'),
  ...generateBatch(801, 850, 'Laptops', 'Tech Elite'),
  ...generateBatch(851, 900, 'Phones', 'Communication Master'),
  ...generateBatch(901, 950, 'Shoes', 'Stride Excellence'),
  ...generateBatch(951, 1000, 'Beauty', 'Elite Curated Masterwork')
];
