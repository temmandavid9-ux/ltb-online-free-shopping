"use client";

import { useState, useMemo } from 'react';
import { products, categories } from '@/lib/data';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import { AiRecommendations } from '@/components/AiRecommendations';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const [filters, setFilters] = useState({
    category: 'Gadgets',
    search: '',
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      const { category, search } = filters;
      const productName = product.name.toLowerCase();
      const productBrand = product.brand.toLowerCase();
      const searchLower = search.toLowerCase();

      return (
        (category === 'All' || product.category === category) &&
        (productName.includes(searchLower) || productBrand.includes(searchLower))
      );
    });
  }, [filters]);

  const handleCategorySelect = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-12">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            <CarouselItem>
              <Card className="bg-primary text-primary-foreground overflow-hidden">
                <div className="flex items-center justify-between p-8">
                    <div className="z-10 max-w-md">
                        <h2 className="text-3xl font-bold mb-2">Upgrade Your Tech</h2>
                        <p className="mb-4 text-primary-foreground/80">Get the latest gadgets at unbeatable prices. Redeem with your earnings!</p>
                        <Button variant="secondary" asChild><Link href="#">Shop Gadgets</Link></Button>
                    </div>
                    <Image src="https://picsum.photos/seed/gadget/400/250" data-ai-hint="gadgets tech" alt="Gadgets" width={400} height={250} className="rounded-lg z-10" />
                </div>
              </Card>
            </CarouselItem>
             <CarouselItem>
              <Card className="bg-accent text-accent-foreground overflow-hidden">
                <div className="flex items-center justify-between p-8">
                    <div className="z-10 max-w-md">
                        <h2 className="text-3xl font-bold mb-2">Fresh Groceries Delivered</h2>
                        <p className="mb-4 text-accent-foreground/80">Stock up your pantry with fresh produce and essentials.</p>
                        <Button variant="secondary" asChild><Link href="#">Shop Groceries</Link></Button>
                    </div>
                    <Image src="https://picsum.photos/seed/grocery/400/250" data-ai-hint="groceries food" alt="Groceries" width={400} height={250} className="rounded-lg z-10" />
                </div>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-4"/>
          <CarouselNext className="right-4"/>
        </Carousel>
      </section>
      
      <CategoryFilter categories={categories} selectedCategory={filters.category} onSelectCategory={handleCategorySelect} />

      <main>
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-headline">
            {filters.category} For You
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold">No products found</h3>
              <p className="text-muted-foreground">Try a different category or search.</p>
            </div>
          )}
        </div>
      </main>
      
      <AiRecommendations />
    </div>
  );
}
