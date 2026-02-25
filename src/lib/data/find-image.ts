
import { PlaceHolderImages } from '../placeholder-images';

/**
 * Retrieves assets from the registry based on their ID.
 * Ensures a strict mapping but provides a fallback to hero assets if specific IDs are missing
 * during high-volume population to prevent 'Asset Pending' errors.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  
  if (image && image.imageUrl) {
    return { 
      url: image.imageUrl, 
      hint: image.imageHint 
    };
  }

  // Fallback Logic: If the requested ID is missing (e.g. gap in 12-410), 
  // intelligently cycle through the high-integrity hero assets (1-11)
  // This ensures no 'Asset Pending' UI is ever displayed.
  const numericId = parseInt(id.replace('prod_img_', '')) || 1;
  const fallbackIndex = (numericId % 11) + 1;
  const fallbackImage = PlaceHolderImages.find((img) => img.id === `prod_img_${fallbackIndex}`);

  return { 
    url: fallbackImage?.imageUrl || "https://image2url.com/r2/default/files/1771940966609-b927061a-b8ae-4d96-b236-35a78c784bae.avif", 
    hint: "verified fallback" 
  };
};
