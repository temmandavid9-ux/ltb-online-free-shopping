import { PlaceHolderImages } from '../placeholder-images';

/**
 * Retrieves a verified master asset from the registry based on ID.
 * If the registry is empty, returns empty strings to trigger fallback UI.
 */
export const findImage = (id: string) => {
  const images = PlaceHolderImages;
  
  if (!images || images.length === 0) {
    return { url: '', hint: 'pending' };
  }

  // Try to find the exact ID match first (e.g., prod_img_1)
  const image = images.find(img => img.id === id);
  if (image) {
    return { url: image.imageUrl, hint: image.imageHint };
  }

  // Robust fallback: If specific ID mapping is missing, cycle through the master assets
  const numId = parseInt(id.replace(/\D/g, '')) || 0;
  const cycleIndex = (numId % images.length) || 0;
  const fallbackImage = images[cycleIndex] || images[0];

  return { 
    url: fallbackImage ? fallbackImage.imageUrl : '', 
    hint: fallbackImage ? fallbackImage.imageHint : 'pending' 
  };
};