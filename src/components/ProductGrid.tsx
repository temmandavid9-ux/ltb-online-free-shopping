'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { categories } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import { useSearchParams } from 'next/navigation';

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    category: 'All',
    search: searchParams.get('q') || '',
  });

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setFilters(prev => ({ ...prev, search: q }));
  }, [searchParams]);

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
  }, [filters, products]);

  const handleCategorySelect = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  }

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-2">Curated Catalog</h2>
        <h3 className="text-4xl font-black font-headline tracking-tighter">
          {filters.category === 'All' ? 'World Class Selection' : `Elite ${filters.category} Collection`}
        </h3>
      </div>

      <CategoryFilter categories={categories} selectedCategory={filters.category} onSelectCategory={handleCategorySelect} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-24 bg-muted/20 rounded-3xl border border-dashed">
            <h3 className="text-xl font-bold font-headline mb-2">No items match your criteria</h3>
            <p className="text-muted-foreground text-sm">Our concierge is sourcing more elite arrivals. Try another collection.</p>
          </div>
        )}
      </div>
    </section>
  );
}
