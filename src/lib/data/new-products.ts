import type { Product } from '../types';
import { getUniqueVerifiedUrls } from './find-image';
import { manualProductNames } from './product-names';

/**
 * Generates the master product catalog dynamically based on unique registry links.
 * 1:1 Alignment: Exclusive Arrival #N = Asset #N in Registry.
 */
const generateVerifiedCatalog = (): Product[] => {
  const uniqueUrls = getUniqueVerifiedUrls();
  const catalog: Product[] = [];
  
  const categories = ['Clothes', 'Wigs', 'Laptops', 'Shoes', 'Watches', 'Underwear', 'Chains', 'Phones', 'Beauty'];
  const brandName = 'LTB Brand';

  uniqueUrls.forEach((url, i) => {
    const index = i + 1;
    const category = categories[i % categories.length];
    
    // Prioritize CEO Manual Names
    const manualName = manualProductNames[index];
    const productName = (manualName && manualName.trim() !== "") ? manualName : `Exclusive Masterpiece #${index}`;
    
    // Deterministic Price/Rating
    const basePrice = 150 + ((index * 7) % 850); 
    const baseRating = Number((4.7 + ((index * 3) % 4) / 10).toFixed(1));
    const baseReviews = 100 + ((index * 13) % 400);

    catalog.push({
      id: `exclusive_arrival_${index}`,
      slug: `exclusive-item-${index}`,
      name: productName,
      description: `Official verified asset from the Less Talk Business Master Registry. Authenticity Code: LTB-VER-${index.toString().padStart(4, '0')}. Verified by CEO URIEL DAVID.`,
      category: category,
      price: basePrice,
      brand: brandName,
      images: [{ url, hint: "verified" }],
      stock: 5 + (index % 15),
      rating: baseRating,
      reviewCount: baseReviews
    });
  });

  return catalog;
};

export const newProducts: Product[] = generateVerifiedCatalog();
