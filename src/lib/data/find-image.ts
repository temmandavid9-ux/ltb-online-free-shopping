import { PlaceHolderImages } from '../placeholder-images';

/**
 * Finds an image in the registry based on the provided ID.
 * Strictly uses links provided in placeholder-images.json.
 * Returns an empty string if missing to ensure no unauthorized images appear.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  
  if (!image || !image.imageUrl) {
    return { 
      url: '', 
      hint: 'Eden 0² Product' 
    };
  }
  
  return { url: image.imageUrl, hint: image.imageHint || 'product image' };
};