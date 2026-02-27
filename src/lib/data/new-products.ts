
import type { Product } from '../types';
import { findImage, getUniqueAssetCount } from './find-image';

/**
 * Generates products dynamically based on the unique links available in all-links.json.
 * This ensures NO REPETITION of images in the store.
 */
const generateVerifiedCatalog = (): Product[] => {
  const uniqueCount = getUniqueAssetCount();
  const catalog: Product[] = [];
  
  // Categories to distribute products across
  const categories = ['Clothes', 'Beauty', 'Watches', 'Chains', 'Wigs', 'Laptops', 'Phones', 'Shoes', 'Underwear'];
  const brands = ['Nexa', 'Stellar', 'Aperture', 'Helios', 'Zenco'];

  for (let i = 1; i <= uniqueCount; i++) {
    const category = categories[i % categories.length];
    const brand = brands[i % brands.length];
    
    catalog.push({
      id: `prod_exclusive_${i}`,
      slug: `exclusive-verified-item-${i}`,
      name: `Exclusive Masterpiece #${i}`,
      description: `A unique, verified asset from the Less Talk Business registry. Representing the pinnacle of quality and status. Authenticity Code: LTB-VER-${i}.`,
      category: category,
      price: Math.floor(Math.random() * (1500 - 150 + 1)) + 150,
      brand: brand,
      images: [findImage(`prod_exclusive_${i}`)],
      stock: Math.floor(Math.random() * 15) + 5,
      rating: Number((4.7 + Math.random() * 0.3).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 400) + 100
    });
  }
  return catalog;
};

export const newProducts: Product[] = generateVerifiedCatalog();
