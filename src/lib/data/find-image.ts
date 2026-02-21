import { PlaceHolderImages } from '../placeholder-images';

/**
 * Finds an image in the registry or generates a unique fallback.
 * This ensures that even if an image ID is missing or a link is broken,
 * the product will still display a unique, high-quality image.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  
  // Extract numerical seed from ID for consistent random generation
  const seed = id.replace(/\D/g, '') || '1';

  if (!image || !image.imageUrl || image.imageUrl.includes('placeholder')) {
    return { 
      url: `https://picsum.photos/seed/${seed}/800/800`, 
      hint: 'product showcase' 
    };
  }
  
  return { url: image.imageUrl, hint: image.imageHint || 'product image' };
};
