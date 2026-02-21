
import { PlaceHolderImages } from '../placeholder-images';

/**
 * Finds an image in the registry based on the provided ID.
 * Strictly uses user-provided links from placeholder-images.json.
 * If an ID is missing, it returns a verified master link from the CEO's collection.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  
  if (!image || !image.imageUrl) {
    // Fallback to a verified master link from your collection if the specific ID is missing
    return { 
      url: 'https://image2url.com/r2/default/images/1770830817088-14a00d33-82c4-4379-be33-5a563ac7612f.jpg', 
      hint: 'Eden 0² verified asset' 
    };
  }
  
  return { url: image.imageUrl, hint: image.imageHint || 'product image' };
};
