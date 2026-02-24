
import { PlaceHolderImages } from '../placeholder-images';

/**
 * Finds an image in the registry based on the provided ID.
 * Uses seeded placeholders to ensure visual consistency across the platform.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  
  // If no specific mapping exists, generate a stable seeded placeholder based on the ID
  const seed = id.replace(/\D/g, '') || 'default';
  const fallbackUrl = `https://picsum.photos/seed/${seed}/600/600`;
  
  return { 
    url: image?.imageUrl || fallbackUrl, 
    hint: image?.imageHint || 'Eden 0² Verified Asset' 
  };
};
