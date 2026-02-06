'use client';

import { useState, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { categories } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
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
  }, [filters, products]);

  const handleCategorySelect = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  }

  return (
    <>
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
    </>
  );
}
