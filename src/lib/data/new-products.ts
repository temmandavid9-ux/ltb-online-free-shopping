import type { Product } from '../types';
import { getUniqueVerifiedUrls } from './find-image';
import { manualProductNames } from './product-names';

/**
 * Dynamic Generation Engine
 * Globally enforcing "LTB Brand" identity.
 */
const generateVerifiedCatalog = (): Product[] => {
  const uniqueUrls = getUniqueVerifiedUrls();
  const catalog: Product[] = [];
  
  const categories = ['Clothes', 'Wigs', 'Laptops', 'Shoes', 'Watches', 'Underwear', 'Chains', 'Phones', 'Beauty'];
  const brandName = 'LTB Brand';

  uniqueUrls.forEach((url, i) => {
    // ASSET #N starts at 1
    const assetNumber = i + 1;
    const category = categories[i % categories.length];
    
    const manualName = manualProductNames[assetNumber];
    const productName = (manualName && manualName.trim() !== "") ? manualName : `Exclusive Masterpiece #${assetNumber}`;
    
    const basePrice = 150 + ((assetNumber * 7) % 850); 
    const baseRating = Number((4.7 + ((assetNumber * 3) % 4) / 10).toFixed(1));
    const baseReviews = 100 + ((assetNumber * 13) % 400);

    catalog.push({
      id: `exclusive_arrival_${assetNumber}`,
      slug: `exclusive-item-${assetNumber}`,
      name: productName,
      description: `Official verified asset from the Less Talk Business Master Registry. Authenticity Code: LTB-VER-${assetNumber.toString().padStart(4, '0')}. Verified by CEO URIEL DAVID.`,
      category: category,
      price: basePrice,
      brand: brandName,
      images: [{ url, hint: "verified" }],
      stock: 5 + (assetNumber % 15),
      rating: baseRating,
      reviewCount: baseReviews
    });
  });

  return catalog;
};

export const newProducts: Product[] = generateVerifiedCatalog();
