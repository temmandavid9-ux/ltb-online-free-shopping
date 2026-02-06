"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useRedeem } from '@/context/CartContext';
import { Star } from 'lucide-react';
import { Badge } from './ui/badge';

type ProductCardProps = {
  product: Product;
};

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center text-yellow-400">
      {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="h-4 w-4 fill-current" />)}
      {halfStar && <Star key="half" className="h-4 w-4 fill-current" />}
      {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="h-4 w-4 text-muted" />)}
    </div>
  );
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToBasket } = useRedeem();

  return (
    <Card className="flex flex-col overflow-hidden h-full group transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-3">
        <Link href={`/product/${product.slug}`} className="block overflow-hidden rounded-md">
          <Image
            src={product.images[0].url}
            alt={product.name}
            data-ai-hint={product.images[0].hint}
            width={600}
            height={600}
            className="aspect-square object-cover w-full transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="pt-3">
          <CardTitle className="text-base font-semibold leading-snug mb-2 h-10">
            <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors">
              {product.name}
            </Link>
          </CardTitle>
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={product.rating} />
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
          <p className="text-lg font-bold text-primary mb-3">
            ₦{product.price.toLocaleString()}
          </p>
          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold" onClick={() => addToBasket(product)}>
            Redeem
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
