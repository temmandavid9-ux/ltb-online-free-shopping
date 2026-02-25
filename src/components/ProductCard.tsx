"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRedeem } from '@/context/CartContext';
import { Star, ImageOff, Plus, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

type ProductCardProps = {
  product: Product;
};

const PriceDisplay = ({ price }: { price: number }) => {
  const priceString = price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [dollars, cents] = priceString.split('.');
  return (
    <div className="flex items-baseline font-headline">
      <span className="text-xs font-bold text-muted-foreground mr-0.5">$</span>
      <span className="text-xl font-black">{dollars}</span>
      <span className="text-xs font-bold text-muted-foreground">.{cents}</span>
    </div>
  );
};

const StarRating = ({ rating, reviewCount }: { rating: number, reviewCount: number }) => {
    return (
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-tighter text-muted-foreground">
        <div className="flex text-yellow-500">
          <Star className="w-2.5 h-2.5 fill-current" />
        </div>
        <span className="font-bold text-foreground">{rating}</span>
        <span>({reviewCount < 1000 ? reviewCount : `${(reviewCount / 1000).toFixed(1)}k`})</span>
      </div>
    );
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToBasket } = useRedeem();
  const [imgSrc, setImgSrc] = useState(product.images[0]?.url || '');
  const [imgError, setImgError] = useState(false);
  const isBestSeller = product.reviewCount > 200;

  useEffect(() => {
    setImgSrc(product.images[0]?.url || '');
    setImgError(false);
  }, [product]);

  return (
    <div className="product-card-hover bg-card group relative flex flex-col h-full border border-border/40 overflow-hidden rounded-xl">
        <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-muted/20">
            {isBestSeller && (
                <div className="absolute top-3 left-3 z-10">
                  <Badge className="bg-foreground text-background border-none font-bold uppercase text-[9px] tracking-widest px-2 py-0.5">
                    Best Seller
                  </Badge>
                </div>
            )}
            {!imgError && imgSrc ? (
              <Image
                src={imgSrc}
                alt={product.name}
                data-ai-hint={product.images[0]?.hint || 'product'}
                width={600}
                height={600}
                priority={product.id === 'prod_160'}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground/20">
                <ImageOff className="w-12 h-12" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>

        <div className="p-4 flex flex-col flex-grow">
            <div className="mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">{product.brand}</span>
            </div>
            
            <h3 className="text-[14px] font-bold leading-tight mb-3 line-clamp-2 min-h-[2.5rem]">
                <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors">
                    {product.name}
                </Link>
            </h3>
            
            <div className="mt-auto pt-4 border-t border-border/40">
                <div className="flex items-center justify-between mb-4">
                    <PriceDisplay price={product.price} />
                    <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                </div>

                <Button 
                  className="w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-black uppercase text-[11px] tracking-[0.2em] h-11 transition-all rounded-lg gap-2"
                  onClick={() => addToBasket(product)}
                >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Redeem
                </Button>
            </div>
        </div>
    </div>
  );
}