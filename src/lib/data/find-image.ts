
import { PlaceHolderImages } from '../placeholder-images';
import masterLinks from '../image-assets/all-links.json';

/**
 * Retrieves the absolute list of unique, verified URLs from the master registry.
 * This is the definitive deduplicated source for Less Talk Business.
 */
export const getUniqueVerifiedUrls = () => {
  const allUrls = Object.values(masterLinks.folders).flat();
  return Array.from(
    new Set(
      allUrls
        .map(url => url.trim())
        .filter(url => url.startsWith('http'))
    )
  );
};

/**
 * Maps a product ID to a unique URL from the deduplicated registry.
 * Ensures that specific ID prefixes correspond to specific indices.
 */
export const findImage = (id: string) => {
  // 1. Priority: Check explicit mapping for system assets (Logo, etc.)
  const systemImage = PlaceHolderImages.find((img) => img.id === id);
  if (systemImage && systemImage.imageUrl) {
    return { url: systemImage.imageUrl, hint: "verified" };
  }

  // 2. Dynamic Registry Mapping
  const uniqueUrls = getUniqueVerifiedUrls();
  const numericMatch = id.match(/\d+$/);
  
  if (numericMatch) {
    const index = parseInt(numericMatch[0]) - 1;
    // We strictly use the index to ensure NO REPETITION across the store
    if (uniqueUrls[index]) {
      return {
        url: uniqueUrls[index],
        hint: "verified"
      };
    }
  }

  // Fallback for unmatched assets
  return { 
    url: '', 
    hint: "verified" 
  };
};

export const getUniqueAssetCount = () => getUniqueVerifiedUrls().length;
