
import { PlaceHolderImages } from '../placeholder-images';

/**
 * Finds an image in the registry based on the provided ID.
 * Strictly uses links provided in placeholder-images.json.
 * Cycles through available assets if a specific ID isn't found to ensure the store is always populated.
 */
export const findImage = (id: string) => {
  // First attempt to find the specific ID
  let image = PlaceHolderImages.find(img => img.id === id);
  
  // If not found, cycle through the first 12 master assets using the ID number
  if (!image) {
    const numericId = parseInt(id.replace(/\D/g, '')) || 0;
    const index = numericId % 12;
    // We skip the fallback entry at the end, using one of the primary 12
    image = PlaceHolderImages[index] || PlaceHolderImages[0];
  }
  
  if (!image || !image.imageUrl) {
    // Ultimate fallback to Asset 13
    return { 
      url: 'https://image2url.com/r2/default/files/1771779927135-5335409b-8cc8-4cc7-b192-905d9c562826.file13', 
      hint: 'Eden 0² Product' 
    };
  }
  
  return { url: image.imageUrl, hint: image.imageHint || 'product image' };
};
