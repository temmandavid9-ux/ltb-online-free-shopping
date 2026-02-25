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
      <span className="text-[9px] font-black text-muted-foreground mr-0.5">$</span>
      <span className="text-xl md:text-2xl font-black text-foreground">{dollars}</span>
      <span className="text-[10px] font-black text-muted-foreground">.{cents}</span>
    </div>
  );
};

const StarRating = ({ rating, reviewCount }: { rating: number, reviewCount: number }) => {
    return (
      <div className="flex items-center gap-1.5 text-[8px] md:text-[9px] uppercase tracking-widest font-black text-muted-foreground">
        <div className="flex text-amber-400">
          <Star className="w-2.5 h-2.5 fill-current" />
        </div>
        <span className="text-foreground">{rating}</span>
        <span className="opacity-40 hidden xs:inline">({reviewCount < 1000 ? reviewCount : `${(reviewCount / 1000).toFixed(1)}k`})</span>
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
    <div className="product-card-hover bg-white group relative flex flex-col h-full border border-border/10 overflow-hidden rounded-[2.5rem] shadow-sm">
        <Link href={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-secondary/10">
            {isExclusive && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-black/80 backdrop-blur-md text-white border-none font-black uppercase text-[7px] tracking-[0.25em] px-3 py-1.5 rounded-full shadow-2xl">
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
                className="object-cover w-full h-full transition-all duration-[1.5s] ease-out group-hover:scale-110"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-secondary/5 text-muted-foreground/20">
                <ImageOff className="w-12 h-12 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">Asset Pending</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />
        </Link>

        <div className="p-5 md:p-7 flex flex-col flex-grow">
            <div className="mb-2">
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-primary/70">{product.brand}</span>
            </div>
            
            <h3 className="text-[14px] md:text-[16px] font-bold leading-tight mb-4 line-clamp-2 min-h-[2.5rem] tracking-tight text-foreground/90 group-hover:text-primary transition-colors">
                <Link href={`/product/${product.slug}`}>
                    {product.name}
                </Link>
            </h3>
            
            <div className="mt-auto pt-5 border-t border-border/5">
                <div className="flex items-center justify-between mb-6">
                    <PriceDisplay price={product.price} />
                    <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                </div>

                <Button 
                  className="w-full bg-black text-white hover:bg-primary hover:text-white font-black uppercase text-[9px] md:text-[10px] tracking-[0.3em] h-12 md:h-14 transition-all rounded-2xl gap-3 shadow-xl shadow-black/5 active:scale-95 btn-luxury border-none"
                  onClick={() => addToBasket(product)}
                >
                    <ShoppingBag className="w-4 h-4 text-primary" />
                    Redeem
                </Button>
            </div>
        </div>
    </div>
  );
}