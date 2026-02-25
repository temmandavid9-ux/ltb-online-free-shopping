import { PlaceHolderImages } from '../placeholder-images';

/**
 * Retrieves assets from the registry based on their ID.
 * Performs a strict lookup to ensure all verified links are displayed.
 */
export const findImage = (id: string) => {
  // Look for the specific ID in our populated registry
  const image = PlaceHolderImages.find((img) => img.id === id);
  
  if (image && image.imageUrl) {
    return { 
      url: image.imageUrl, 
      hint: image.imageHint 
    };
  }

  // Fallback if no specific mapping is found
  return { 
    url: "", 
    hint: "asset pending" 
  };
};
