
import { PlaceHolderImages } from '../placeholder-images';

/**
 * Finds an image in the registry based on the provided ID.
 * Returns the latest verified master asset if a specific mapping is missing.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  // The Master Link provided by CEO
  const masterLink = 'https://image2url.com/r2/default/files/1771936544705-6f115c1c-270b-4a22-9ab8-f3abf8d75145.zip';
  
  return { 
    url: image?.imageUrl || masterLink, 
    hint: image?.imageHint || 'Eden 0² Master Asset' 
  };
};
