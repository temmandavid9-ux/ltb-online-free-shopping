
import masterLinks from '../image-assets/all-links.json';

/**
 * Retrieves the absolute list of unique, verified URLs from the master registry.
 * This is the definitive deduplicated source for Less Talk Business.
 */
export const getUniqueVerifiedUrls = () => {
  // Flatten all folders into one array
  const allUrls = Object.values(masterLinks.folders).flat();
  
  // Clean and Deduplicate using a Set
  const uniqueSet = new Set(
    allUrls
      .map(url => url.trim())
      .filter(url => url.startsWith('http'))
  );
  
  return Array.from(uniqueSet);
};

/**
 * Maps an ID to a unique URL.
 * Note: For the dynamic catalog, we pass the URL directly in the product data.
 * This function remains for legacy or system asset resolution.
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
  const numericMatch = id.match(/\d+$/);
  
  if (numericMatch) {
    const index = parseInt(numericMatch[0]) - 1;
    if (uniqueUrls[index]) {
      return {
        url: uniqueUrls[index],
        hint: "verified"
      };
    }
  }

  return { 
    url: '', 
    hint: "verified" 
  };
};

export const getUniqueAssetCount = () => getUniqueVerifiedUrls().length;
