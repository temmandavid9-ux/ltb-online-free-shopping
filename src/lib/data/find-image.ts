import { PlaceHolderImages } from '../placeholder-images';

/**
 * Finds an image in the registry based on the provided ID.
 * All AI-generated fallbacks have been removed as requested.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  
  if (!image || !image.imageUrl) {
    // Return an empty state or a standard missing image reference if no link exists in the provided catalog
    return { 
      url: '', 
      hint: 'image not provided' 
    };
  }
  
  return { url: image.imageUrl, hint: image.imageHint || 'product image' };
};
