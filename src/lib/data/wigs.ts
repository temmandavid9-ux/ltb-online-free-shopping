import type { Product } from '../types';
import { findImage } from './find-image';

export const wigProducts: Product[] = [
  {
    id: 'prod_332',
    slug: 'product-332',
    name: 'LTB Sun-Kissed Wig',
    description: 'Instantly transform your style. Expertly crafted from heat-resistant fibers, the Sun-Kissed Wig offers a stunningly natural look and feel that’s sure to turn heads.',
    category: 'Wigs',
    price: 139.99,
    brand: 'LTB Brand',
    images: [findImage('prod_img_332')],
    stock: 25,
    rating: 4.7,
    reviewCount: 105,
  },
  {
    id: 'prod_333',
    slug: 'product-333',
    name: 'LTB Natural Tones Wig',
    description: 'Embrace a new you. Featuring rich, multi-tonal color and a luxuriously soft texture, it provides a look of natural elegance and charm for any occasion.',
    category: 'Wigs',
    price: 169,
    brand: 'LTB Brand',
    images: [findImage('prod_img_333')],
    stock: 20,
    rating: 4.8,
    reviewCount: 95,
  },
  {
    id: 'prod_334',
    slug: 'product-334',
    name: 'LTB Vivid Fire Opal Wig',
    description: 'Make a bold statement with the Vivid Fire Opal Wig. Its vibrant colors and high-quality synthetic fibers create a look that is both stunning and unique.',
    category: 'Wigs',
    price: 150,
    brand: 'LTB Brand',
    images: [findImage('prod_img_334')],
    stock: 22,
    rating: 4.8,
    reviewCount: 75,
  }
];
