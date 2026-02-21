import { PlaceHolderImages } from '../placeholder-images';

/**
 * Finds an image in the registry or generates a unique fallback.
 * This version is enhanced to be more robust against missing IDs or broken links.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  
  // Extract numerical seed from ID for consistent random generation
  const seed = id.replace(/\D/g, '') || '1';

  // If the image entry is missing, invalid, or is a generic placeholder, generate a high-quality unique fallback
  if (!image || !image.imageUrl || image.imageUrl.includes('placehold.co')) {
    return { 
      url: `https://picsum.photos/seed/${seed}/800/800`, 
      hint: 'product showcase' 
    };
  }
  
  return { url: image.imageUrl, hint: image.imageHint || 'product image' };
};
