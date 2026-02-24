
import { PlaceHolderImages } from '../placeholder-images';

/**
 * Retrieves a verified master asset from the registry based on ID.
 */
export const findImage = (id: string) => {
  const images = PlaceHolderImages;
  
  // Try to find the exact ID match first
  const image = images.find(img => img.id === id);
  if (image) {
    return { url: image.imageUrl, hint: image.imageHint };
  }

  // If not found, use cyclical mapping for consistent coverage
  const numId = parseInt(id.replace(/\D/g, '')) || 0;
  const cycleIndex = (numId % images.length) || 0;
  const fallbackImage = images[cycleIndex] || images[0];

  return { 
    url: fallbackImage.imageUrl, 
    hint: fallbackImage.imageHint 
  };
};
