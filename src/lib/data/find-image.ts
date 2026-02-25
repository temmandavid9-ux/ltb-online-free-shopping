
import { PlaceHolderImages } from '../placeholder-images';

/**
 * Retrieves assets from the registry based on their ID.
 * Ensures a strict one-to-one mapping to prevent link repetition.
 */
export const findImage = (id: string) => {
  // Strict lookup in the deduplicated registry
  const image = PlaceHolderImages.find((img) => img.id === id);
  
  if (image && image.imageUrl) {
    return { 
      url: image.imageUrl, 
      hint: image.imageHint 
    };
  }

  // No repetition allowed: if no unique asset is mapped to this ID, return empty.
  return { 
    url: "", 
    hint: "unique asset pending" 
  };
};
