import { PlaceHolderImages } from '../placeholder-images';

/**
 * Retrieves assets from the registry based on their ID.
 * Returns empty assets as all links have been purged.
 */
export const findImage = (id: string) => {
  // Direct lookup in the (now empty) registry
  const image = PlaceHolderImages.find((img) => img.id === id);
  
  if (image) {
    return { 
      url: image.imageUrl, 
      hint: image.imageHint 
    };
  }

  // Universal empty fallback
  return { 
    url: "", 
    hint: "asset pending" 
  };
};