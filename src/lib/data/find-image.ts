
import { PlaceHolderImages } from '../placeholder-images';

/**
 * Retrieves assets from the registry based on their ID.
 * Reverted from universal mapping to specific lookup to allow for unique product visuals.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  
  if (image) {
    return { 
      url: image.imageUrl, 
      hint: image.imageHint 
    };
  }

  // Fallback to empty values if no specific mapping exists
  return { 
    url: "", 
    hint: "pending" 
  };
};
