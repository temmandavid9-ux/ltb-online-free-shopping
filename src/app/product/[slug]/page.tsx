"use client";

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/lib/data';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Star, ShieldCheck, Truck, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
} from "@/components/ui/card"


// This function is commented out as it is not needed for the user request
// to statically generate pages for each product, which is better for SEO.
// export async function generateStaticParams() {
//   return products.map((product) => ({
//     slug: product.slug,
//   }));
// }

const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product?.images[0]);

  if (!product || !mainImage) {
    notFound();
  }

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, Math.min(product.stock, prev + change)));
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Image Gallery */}
        <div>
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="aspect-square w-full overflow-hidden rounded-lg">
                <Image
                  src={mainImage.url}
                  alt={product.name}
                  data-ai-hint={mainImage.hint}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setMainImage(image)}
                className={`aspect-square rounded-md overflow-hidden border-2 ${mainImage.url === image.url ? 'border-primary' : 'border-transparent'} transition-all`}
              >
                <Image
                  src={image.url}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  data-ai-hint={image.hint}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <Badge variant="outline">{product.brand}</Badge>
          <h1 className="text-4xl font-bold font-headline">{product.name}</h1>
          <div className="flex items-center space-x-2">
            <div className="flex text-yellow-400">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 text-muted" />
            </div>
            <span className="text-sm text-muted-foreground">(123 reviews)</span>
          </div>
          <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>+</Button>
            </div>
            <Button size="lg" className="flex-grow bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => addToCart(product, quantity)}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
          {product.stock < 20 && (
            <p className="text-sm text-destructive font-medium">Only {product.stock} left in stock!</p>
          )}

          <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>2-year warranty included</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
