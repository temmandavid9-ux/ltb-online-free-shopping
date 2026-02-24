import { PlaceHolderImages } from '../placeholder-images';

/**
 * Finds an image in the registry based on the provided ID.
 * Returns the latest verified master asset if a specific mapping is missing.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  const fallbackUrl = 'https://image2url.com/r2/default/files/1771936544705-6f115c1c-270b-4a22-9ab8-f3abf8d75145.zip';
  
  if (!image || !image.imageUrl) {
    return { 
      url: fallbackUrl, 
      hint: 'Eden 0² Master Asset' 
    };
  }
  
  return { url: image.imageUrl, hint: image.imageHint || 'product image' };
};