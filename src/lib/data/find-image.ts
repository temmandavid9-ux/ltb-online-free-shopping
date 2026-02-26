import { PlaceHolderImages } from '../placeholder-images';

/**
 * Retrieves assets from the registry based on their ID.
 * This is the definitive source for Eden 0² visuals.
 * Only verified assets from the user's transmissions are utilized.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  
  if (image && image.imageUrl) {
    return { 
      url: image.imageUrl, 
      hint: image.imageHint 
    };
  }

  // Assets not in registry remain in "Pending" state to avoid synthetic AI placeholders.
  return { 
    url: '', 
    hint: "verified" 
  };
};