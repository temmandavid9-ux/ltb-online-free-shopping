
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

// CEO Expansion: Generating 1000 items to accommodate all unique verified links
export const newProducts: Product[] = [
  ...generateBatch(1, 100, 'Clothes', 'Executive Collection'),
  ...generateBatch(101, 200, 'Beauty', 'Premium Selection'),
  ...generateBatch(201, 300, 'Clothes', 'Performance Elite'),
  ...generateBatch(301, 400, 'Watches', 'Lifestyle Master'),
  ...generateBatch(401, 500, 'Chains', 'Curated Luxury'),
  ...generateBatch(501, 600, 'Wigs', 'Signature Piece'),
  ...generateBatch(601, 700, 'Beauty', 'Heritage Elite'),
  ...generateBatch(701, 800, 'Beauty', 'Supreme Executive'),
  ...generateBatch(801, 900, 'Laptops', 'Tech Elite'),
  ...generateBatch(901, 1000, 'Phones', 'Communication Master')
];
