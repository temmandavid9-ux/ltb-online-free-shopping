
import { PlaceHolderImages } from '../placeholder-images';
import masterLinks from '../image-assets/all-links.json';

/**
 * Retrieves assets from the registry based on their ID.
 * This is the definitive source for Less Talk Business visuals.
 * Deduplicates links to ensure no repetition.
 */
export const findImage = (id: string) => {
  // 1. Check explicit ID mapping first (for Logo, etc.)
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (image && image.imageUrl) {
    return { 
      url: image.imageUrl, 
      hint: "verified" 
    };
  }

  // 2. Dynamic numeric mapping for product IDs (e.g., prod_img_450)
  const numericMatch = id.match(/\d+$/);
  if (numericMatch) {
    const index = parseInt(numericMatch[0]) - 1; // 0-based index
    
    // Flatten all folder arrays into a single master list and DEDUPLICATE
    // This ensures that even if links are repeated in all-links.json, they appear only once in store
    const allVerifiedUrls = Array.from(
      new Set(
        Object.values(masterLinks.folders)
          .flat()
          .map(url => url.trim())
          .filter(url => url.startsWith('http'))
      )
    );
    
    if (allVerifiedUrls[index]) {
      return {
        url: allVerifiedUrls[index],
        hint: "verified"
      };
    }
  }

  // Assets not in registry remain in "Pending" state
  return { 
    url: '', 
    hint: "verified" 
  };
};
