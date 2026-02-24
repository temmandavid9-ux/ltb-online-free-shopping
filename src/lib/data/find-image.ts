import { PlaceHolderImages } from '../placeholder-images';

/**
 * Finds an image in the registry based on the provided ID.
 * Returns an empty URL if not found, triggering the 'Asset Pending' UI state.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  
  if (!image || !image.imageUrl) {
    return { 
      url: '', 
      hint: 'Eden 0² Asset Pending' 
    };
  }
  
  return { url: image.imageUrl, hint: image.imageHint || 'product image' };
};
