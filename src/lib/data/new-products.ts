
import type { Product } from '../types';
import { getUniqueVerifiedUrls } from './find-image';

/**
 * Generates the master product catalog dynamically based on unique registry links.
 * Every unique link in all-links.json is represented exactly once as a unique product.
 * This ensures ZERO repetition in the store.
 */
const generateVerifiedCatalog = (): Product[] => {
  const uniqueUrls = getUniqueVerifiedUrls();
  const catalog: Product[] = [];
  
  // Filter out the master logo if it exists in the unique set to keep store clean
  const masterLogoUrl = "https://image2url.com/r2/default/images/1772178137302-2b78055d-a492-42f2-ab5c-2f9d1cb163cc.png";
  const productUrls = uniqueUrls.filter(url => url !== masterLogoUrl);

  const categories = ['Clothes', 'Wigs', 'Laptops', 'Shoes', 'Watches', 'Underwear', 'Chains', 'Phones', 'Beauty'];
  const brands = ['Nexa', 'Stellar', 'Aperture', 'Helios', 'Zenco'];

  productUrls.forEach((url, i) => {
    const index = i + 1;
    const category = categories[i % categories.length];
    const brand = brands[i % brands.length];
    
    catalog.push({
      id: `exclusive_arrival_${index}`,
      slug: `exclusive-item-${index}`,
      name: `Exclusive Masterpiece #${index}`,
      description: `A unique, verified asset from the Less Talk Business master registry. Representing the zenith of quality and professional status. Authenticity Code: LTB-VER-${index.toString().padStart(4, '0')}. Verified by CEO.`,
      category: category,
      price: Math.floor(Math.random() * (1200 - 150 + 1)) + 150,
      brand: brand,
      images: [{ url, hint: "verified" }],
      stock: Math.floor(Math.random() * 15) + 5,
      rating: Number((4.7 + Math.random() * 0.3).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 400) + 100
    });
  });

  return catalog;
};

export const newProducts: Product[] = generateVerifiedCatalog();
