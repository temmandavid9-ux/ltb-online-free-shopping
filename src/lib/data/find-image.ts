import { PlaceHolderImages } from '../placeholder-images';

export const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    // Return a default placeholder if no image is found
    return { url: 'https://placehold.co/600x400', hint: 'placeholder' };
  }
  return { url: image.imageUrl, hint: image.imageHint };
};
