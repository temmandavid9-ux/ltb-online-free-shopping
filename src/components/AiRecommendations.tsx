import { getPersonalizedRecommendations } from '@/ai/flows/personalized-product-recommendations';
import { products } from '@/lib/data';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';

type RecommendedProduct = Product & { reason: string };

export async function AiRecommendations() {
  let recommendedProducts: RecommendedProduct[] = [];
  try {
    const recommendations = await getPersonalizedRecommendations({
      // In a real app, this would come from the user's session
      userId: 'user-123',
      browsingHistory: ['prod_1', 'prod_4'],
      purchaseHistory: ['prod_9'],
    });

    recommendedProducts = recommendations.recommendedProducts
      .map(rec => {
        const product = products.find(p => p.id === rec.productId);
        if (product) {
          return {
            ...product,
            reason: rec.reason,
          };
        }
        return null;
      })
      .filter((p): p is RecommendedProduct => p !== null);

  } catch (error) {
    console.error("Failed to get AI recommendations:", error);
    // Fallback to showing some popular items or nothing
    return null;
  }
  
  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-8 h-8 text-accent" />
        <h2 className="text-3xl font-bold font-headline">Recommended For You</h2>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {recommendedProducts.map((product, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <ProductCard product={product} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
