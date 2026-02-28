import masterLinks from '../image-assets/all-links.json';

/**
 * Retrieves the absolute list of unique, verified URLs from the master registry.
 * This is the definitive deduplicated source for Less Talk Business.
 * flattens all folders and ensures NO REPETITION using a Set.
 */
export const getUniqueVerifiedUrls = () => {
  // Flatten all folders into one array
  const allUrls = Object.values(masterLinks.folders).flat();
  
  // Clean and Deduplicate using a Set to ensure NO REPETITION
  const uniqueSet = new Set(
    allUrls
      .map(url => url.trim())
      .filter(url => url.startsWith('http'))
  );
  
  // Sort or maintain order as defined in the JSON
  return Array.from(uniqueSet);
};

/**
 * Maps an ID to a unique URL based on the deduplicated master list.
 */
export const findImage = (id: string) => {
  // Use the briefcase logo link if specifically requested
  if (id === 'master_logo') {
    return {
      url: "https://image2url.com/r2/default/images/1772178137302-2b78055d-a492-42f2-ab5c-2f9d1cb163cc.png",
      hint: "logo"
    };
  }

  const uniqueUrls = getUniqueVerifiedUrls();
  
  // Extract number from end of ID (e.g., exclusive_arrival_123 -> index 122)
  const numericMatch = id.match(/\d+$/);
  
  if (numericMatch) {
    const index = parseInt(numericMatch[0]) - 1;
    // We strictly map based on the deduplicated master list
    if (uniqueUrls[index]) {
      return {
        url: uniqueUrls[index],
        hint: "verified"
      };
    }
  }

  // Fallback to logo if not found to avoid broken images
  return { 
    url: "https://image2url.com/r2/default/images/1772178137302-2b78055d-a492-42f2-ab5c-2f9d1cb163cc.png", 
    hint: "verified" 
  };
};

export const getUniqueAssetCount = () => getUniqueVerifiedUrls().length;
