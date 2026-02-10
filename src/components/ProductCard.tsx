"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRedeem } from '@/context/CartContext';
import { Star } from 'lucide-react';

type ProductCardProps = {
  product: Product;
};

const PriceDisplay = ({ price }: { price: number }) => {
  const priceString = price.toFixed(2);
  const [dollars, cents] = priceString.split('.');
  return (
    <div className="flex items-baseline text-accent">
      <span className="text-lg font-bold">$</span>
      <span className="text-3xl font-bold">{dollars}</span>
      <span className="text-lg font-bold">.{cents}</span>
    </div>
  );
};

const StarRating = ({ rating, reviewCount }: { rating: number, reviewCount: number }) => {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
        <span className="font-medium text-foreground">{rating}</span>
        <span>({reviewCount < 1000 ? reviewCount : `${(reviewCount / 1000).toFixed(1)}k`})</span>
      </div>
    );
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToBasket } = useRedeem();
  const isBestSeller = product.reviewCount > 200;

  return (
    <div className="bg-card rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg flex flex-col h-full border">
        <Link href={`/product/${product.slug}`} className="block overflow-hidden relative">
            {isBestSeller && (
                <div className="absolute top-2 left-0 bg-accent text-accent-foreground text-xs font-bold py-1 px-2.5 rounded-r-md z-10">
                Best Seller
                </div>
            )}
            <Image
            src={product.images[0].url}
            alt={product.name}
            data-ai-hint={product.images[0].hint}
            width={600}
            height={600}
            className="aspect-square object-cover w-full transition-transform duration-300 group-hover:scale-105"
            />
        </Link>

        <div className="p-3 flex flex-col flex-grow">
            <h3 className="text-sm font-medium text-foreground leading-snug h-10 mb-2">
                <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors">
                    {product.name}
                </Link>
            </h3>
            
            <div className="mt-auto space-y-3">
                <div className="flex items-center justify-between">
                    <PriceDisplay price={product.price} />
                </div>

                <StarRating rating={product.rating} reviewCount={product.reviewCount} />

                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-lg" onClick={() => addToBasket(product)}>
                    Redeem
                </Button>
            </div>
        </div>
    </div>
  );
}
