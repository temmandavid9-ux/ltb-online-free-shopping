"use client";

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/lib/data';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRedeem } from '@/context/CartContext';
import { Star, ShieldCheck, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from "@/components/ui/card";

const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  const product = getProductBySlug(slug);
  const { addToBasket } = useRedeem();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!product) {
    notFound();
  }

  const mainImage = selectedImage || product.images[0]?.url;

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, Math.min(product.stock, prev + change)));
  };

  const StarRating = ({ rating, reviewCount }: { rating: number, reviewCount: number }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-2">
        <div className="flex text-yellow-400">
          {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="h-5 w-5 fill-current" />)}
          {halfStar && <Star key="half" className="h-5 w-5 fill-current" />}
          {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="h-5 w-5 text-muted" />)}
        </div>
        <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Image Gallery */}
        <div>
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="aspect-square w-full overflow-hidden rounded-lg">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={product.name}
                    width={800}
                    height={800}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Asset Pending</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image.url)}
                className={`aspect-square rounded-md overflow-hidden border-2 ${mainImage === image.url ? 'border-primary' : 'border-transparent'} transition-all`}
              >
                {image.url ? (
                  <Image
                    src={image.url}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <Badge variant="outline">{product.brand}</Badge>
          <h1 className="text-4xl font-bold font-headline">{product.name}</h1>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          <p className="text-3xl font-bold text-primary">${product.price.toLocaleString()}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>+</Button>
            </div>
            <Button size="lg" className="flex-grow bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base" onClick={() => addToBasket(product, quantity)}>
              Redeem Item
            </Button>
          </div>

          <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>Verified Authentic Origin</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <span>Global Elite Logistics</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}