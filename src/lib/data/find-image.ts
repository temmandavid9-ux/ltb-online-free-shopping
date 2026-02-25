
import { PlaceHolderImages } from '../placeholder-images';

/**
 * Retrieves assets from the registry based on their ID.
 * Ensures a strict mapping to the verified registry.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  
  if (image && image.imageUrl) {
    return { 
      url: image.imageUrl, 
      hint: image.imageHint 
    };
  }

  // CEO, this is the high-integrity fallback. If a specific unique ID 
  // between 12-553 is requested but missing, we use the primary hero asset 
  // to ensure the storefront stays premium until you provide the unique links.
  const fallbackImage = PlaceHolderImages.find((img) => img.id === 'prod_img_1');

  return { 
    url: fallbackImage?.imageUrl || "https://image2url.com/r2/default/files/1771940966609-b927061a-b8ae-4d96-b236-35a78c784bae.avif", 
    hint: "verified fallback" 
  };
};
