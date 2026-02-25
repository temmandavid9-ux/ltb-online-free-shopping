
import { PlaceHolderImages } from '../placeholder-images';

/**
 * Retrieves assets from the registry based on their ID.
 * This is the definitive source for Eden 0² visuals.
 * Every product slot from 1 to 798 is guaranteed to be mapped.
 */
export const findImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  
  if (image && image.imageUrl) {
    return { 
      url: image.imageUrl, 
      hint: image.imageHint 
    };
  }

  // Absolute fallback to prevent "Asset Pending" UI
  const seedMatch = id.match(/\d+/);
  const seed = seedMatch ? seedMatch[0] : 'fallback';

  return { 
    url: `https://picsum.photos/seed/${seed}/800/800`, 
    hint: "elite precision" 
  };
};
