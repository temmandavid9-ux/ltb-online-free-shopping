import { PlaceHolderImages } from '../placeholder-images';

/**
 * Finds an image in the registry or generates a unique fallback.
 * This ensures that even if an image ID is missing from placeholder-images.json,
 * the product will still display a unique, high-quality image.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  
  if (!image) {
    // Generate a unique seed from the ID (e.g., 'prod_img_160' -> '160')
    const seed = id.replace(/\D/g, '') || '1';
    return { 
      url: `https://picsum.photos/seed/${seed}/600/600`, 
      hint: 'product placeholder' 
    };
  }
  
  return { url: image.imageUrl, hint: image.imageHint };
};
