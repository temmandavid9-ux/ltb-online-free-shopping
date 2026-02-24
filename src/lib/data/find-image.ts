
import { PlaceHolderImages } from '../placeholder-images';

/**
 * Retrieves a verified master asset from the registry based on ID.
 * If the exact ID isn't found, it cycles through the 13 available master links.
 */
export const findImage = (id: string) => {
  const images = PlaceHolderImages;
  
  // Try to find the exact ID match first (e.g., prod_img_1)
  const image = images.find(img => img.id === id);
  if (image) {
    return { url: image.imageUrl, hint: image.imageHint };
  }

  // Robust fallback: If specific ID mapping is missing, cycle through the 13 master assets
  // based on the numerical part of the ID.
  const numId = parseInt(id.replace(/\D/g, '')) || 0;
  // We use modulo 13 because we have 13 master links (file1 to file13)
  const cycleIndex = (numId % images.length) || 0;
  const fallbackImage = images[cycleIndex] || images[0];

  return { 
    url: fallbackImage.imageUrl, 
    hint: fallbackImage.imageHint 
  };
};
