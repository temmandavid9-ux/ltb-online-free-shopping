
import { PlaceHolderImages } from '../placeholder-images';

/**
 * Finds an image in the registry based on the provided ID.
 * Strictly uses user-provided links from placeholder-images.json.
 * No AI fallbacks.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  
  if (!image || !image.imageUrl) {
    // Return empty URL if not in registry
    return { 
      url: '', 
      hint: 'image asset not found' 
    };
  }
  
  return { url: image.imageUrl, hint: image.imageHint || 'product image' };
};
