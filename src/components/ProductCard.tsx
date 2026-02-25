"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRedeem } from '@/context/CartContext';
import { Star, ImageOff, ShoppingBag } from 'lucide-react';
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
      <span className="text-[10px] font-black text-muted-foreground mr-0.5">$</span>
      <span className="text-xl font-black text-foreground">{dollars}</span>
      <span className="text-[10px] font-black text-muted-foreground">.{cents}</span>
    </div>
  );
};

const StarRating = ({ rating, reviewCount }: { rating: number, reviewCount: number }) => {
    return (
      <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-black text-muted-foreground">
        <div className="flex text-amber-400">
          <Star className="w-2.5 h-2.5 fill-current" />
        </div>
        <span className="text-foreground">{rating}</span>
        <span className="opacity-50">({reviewCount < 1000 ? reviewCount : `${(reviewCount / 1000).toFixed(1)}k`})</span>
      </div>
    );
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToBasket } = useRedeem();
  const [imgSrc, setImgSrc] = useState(product.images[0]?.url || '');
  const [imgError, setImgError] = useState(false);
  const isExclusive = product.id.includes('exclusive');

  useEffect(() => {
    setImgSrc(product.images[0]?.url || '');
    setImgError(false);
  }, [product]);

  return (
    <div className="product-card-hover bg-white group relative flex flex-col h-full border border-border/20 overflow-hidden rounded-[2rem]">
        <Link href={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-muted/5">
            {isExclusive && (
                <div className="absolute top-5 left-5 z-10">
                  <Badge className="bg-black text-white border-none font-black uppercase text-[8px] tracking-[0.2em] px-3 py-1 rounded-full shadow-2xl">
                    Exclusive
                  </Badge>
                </div>
            )}
            {!imgError && imgSrc ? (
              <Image
                src={imgSrc}
                alt={product.name}
                data-ai-hint={product.images[0]?.hint || 'luxury product'}
                width={600}
                height={750}
                priority={product.id.includes('exclusive_1')}
                className="object-cover w-full h-full transition-all duration-[1.2s] ease-out group-hover:scale-110"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground/10">
                <ImageOff className="w-16 h-16" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700" />
        </Link>

        <div className="p-6 flex flex-col flex-grow">
            <div className="mb-2">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">{product.brand}</span>
            </div>
            
            <h3 className="text-[15px] font-bold leading-tight mb-4 line-clamp-2 min-h-[2.5rem] tracking-tight text-foreground/90">
                <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors">
                    {product.name}
                </Link>
            </h3>
            
            <div className="mt-auto pt-5 border-t border-border/10">
                <div className="flex items-center justify-between mb-5">
                    <PriceDisplay price={product.price} />
                    <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                </div>

                <Button 
                  className="w-full bg-black text-white hover:bg-primary hover:text-white font-black uppercase text-[10px] tracking-[0.25em] h-14 transition-all rounded-2xl gap-3 shadow-xl shadow-black/5 active:scale-95"
                  onClick={() => addToBasket(product)}
                >
                    <ShoppingBag className="w-4 h-4" />
                    Redeem Item
                </Button>
            </div>
        </div>
    </div>
  );
}