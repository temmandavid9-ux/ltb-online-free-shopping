
import { PlaceHolderImages } from '../placeholder-images';

/**
 * Finds an image in the registry or generates a unique fallback.
 * Enhanced to handle missing IDs or broken links by using a deterministic seed.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  
  // Extract numerical seed from ID for consistent fallback generation
  const seed = id.replace(/\D/g, '') || '1';

  // If the image entry is missing or the URL is a generic placeholder, use a high-quality fallback
  if (!image || !image.imageUrl || image.imageUrl.includes('placehold.co')) {
    // Fallback to a high-quality item photo based on the ID seed
    return { 
      url: `https://picsum.photos/seed/${seed}/800/800`, 
      hint: 'product showcase' 
    };
  }
  
  return { url: image.imageUrl, hint: image.imageHint || 'product image' };
};
