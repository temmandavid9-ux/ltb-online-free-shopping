import { PlaceHolderImages } from '../placeholder-images';

/**
 * Finds an image in the registry based on the provided ID.
 * Strictly uses links provided in placeholder-images.json.
 * Returns a fallback if the ID is missing to ensure no broken images.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  
  if (!image || !image.imageUrl) {
    // Return a default entry from the registry if specific ID is missing
    return { 
      url: 'https://image2url.com/r2/default/images/1770830817088-14a00d33-82c4-4379-be33-5a563ac7612f.jpg', 
      hint: 'Eden 0² Product' 
    };
  }
  
  return { url: image.imageUrl, hint: image.imageHint || 'product image' };
};