
import { PlaceHolderImages } from '../placeholder-images';

/**
 * Retrieves assets from the registry based on their ID.
 * If the asset is not found in the registry, it generates a unique, 
 * high-integrity placeholder using picsum.photos to ensure no 
 * "Asset Pending" states are visible to the user.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  
  if (image && image.imageUrl) {
    return { 
      url: image.imageUrl, 
      hint: image.imageHint 
    };
  }

  // Extract the numeric part of the ID for the seed (e.g., prod_img_127 -> 127)
  const seedMatch = id.match(/\d+/);
  const seed = seedMatch ? seedMatch[0] : 'fallback';

  return { 
    url: `https://picsum.photos/seed/${seed}/800/800`, 
    hint: "elite quality" 
  };
};
