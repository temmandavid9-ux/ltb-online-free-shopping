
import { PlaceHolderImages } from '../placeholder-images';

/**
 * Finds an image in the registry based on the provided ID.
 * Strictly uses links provided in placeholder-images.json.
 * If an ID is missing, it returns null to prevent unauthorized substitution.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  
  if (!image || !image.imageUrl) {
    return { url: '', hint: 'pending' };
  }
  
  return { url: image.imageUrl, hint: image.imageHint || 'product image' };
};
