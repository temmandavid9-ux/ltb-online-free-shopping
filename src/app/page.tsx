"use client";

import { useState, useMemo } from 'react';
import { products, categories, brands } from '@/lib/data';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import { AiRecommendations } from '@/components/AiRecommendations';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [filters, setFilters] = useState({
    category: 'all',
    price: [0, 1500],
    brands: [] as string[],
    search: '',
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      const { category, price, brands: brandFilters, search } = filters;
      const productName = product.name.toLowerCase();
      const productBrand = product.brand.toLowerCase();
      const searchLower = search.toLowerCase();

      return (
        (category === 'all' || product.category === category) &&
        product.price >= price[0] &&
        product.price <= price[1] &&
        (brandFilters.length === 0 || brandFilters.includes(product.brand)) &&
        (productName.includes(searchLower) || productBrand.includes(searchLower))
      );
    });
  }, [filters]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="relative bg-primary text-primary-foreground rounded-xl p-8 md:p-12 mb-12 overflow-hidden flex items-center min-h-[300px]">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-accent/30 opacity-70"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 leading-tight">
            Discover Your Next Favorite Thing
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-6">
            Explore our curated collection of high-quality products, tailored just for you.
          </p>
          <Button size="lg" variant="secondary" className="group">
            Shop Now <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <FilterSidebar
            categories={categories}
            brands={brands}
            filters={filters}
            setFilters={setFilters}
          />
        </aside>

        <main className="lg:col-span-3">
          {filters.search && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-headline">
                Search results for "{filters.search}"
              </h2>
              <p className="text-muted-foreground">{filteredProducts.length} items found.</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-semibold">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <AiRecommendations />
    </div>
  );
}
