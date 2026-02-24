
import { PlaceHolderImages } from '../placeholder-images';

/**
 * Retrieves assets from the registry based on their ID.
 * Cyclic fallback ensures IDs prod_img_16 and above still display one of the verified 15 assets.
 */
export const findImage = (id: string) => {
  // First, try direct lookup
  let image = PlaceHolderImages.find((img) => img.id === id);
  
  // If not found, and it's a prod_img_N pattern, cycle through the first 15
  if (!image && id.startsWith('prod_img_')) {
    const num = parseInt(id.replace('prod_img_', ''));
    if (!isNaN(num)) {
      const cycleIndex = ((num - 1) % 15) + 1;
      const cycleId = `prod_img_${cycleIndex}`;
      image = PlaceHolderImages.find((img) => img.id === cycleId);
    }
  }

  if (image) {
    return { 
      url: image.imageUrl, 
      hint: image.imageHint 
    };
  }

  // Absolute fallback to first verified asset
  return { 
    url: PlaceHolderImages[0]?.imageUrl || "", 
    hint: "verified asset" 
  };
};
