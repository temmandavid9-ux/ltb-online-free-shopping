"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import type { Category } from '@/lib/types';
import { Search } from 'lucide-react';

type FilterSidebarProps = {
  categories: Category[];
  brands: string[];
  filters: any;
  setFilters: (filters: any) => void;
};

export default function FilterSidebar({ categories, brands, filters, setFilters }: FilterSidebarProps) {
  
  const handleCategoryChange = (categoryId: string) => {
    setFilters({ ...filters, category: categoryId });
  };

  const handlePriceChange = (value: number[]) => {
    setFilters({ ...filters, price: value });
  };
  
  const handleBrandChange = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b: string) => b !== brand)
      : [...filters.brands, brand];
    setFilters({ ...filters, brands: newBrands });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="font-headline">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-10" 
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <ul className="space-y-2">
            <li>
              <button onClick={() => handleCategoryChange('all')} className={`w-full text-left text-sm ${filters.category === 'all' ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}>All</button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button onClick={() => handleCategoryChange(cat.name)} className={`w-full text-left text-sm flex items-center gap-2 ${filters.category === cat.name ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}>
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Price Range</h3>
          <Slider
            min={0}
            max={1500}
            step={10}
            value={filters.price}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>${filters.price[0]}</span>
            <span>${filters.price[1]}</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Brands</h3>
          <ul className="space-y-2">
            {brands.map((brand) => (
              <li key={brand} className="flex items-center space-x-2">
                <Checkbox 
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => handleBrandChange(brand)}
                />
                <Label htmlFor={`brand-${brand}`} className="text-sm font-normal">{brand}</Label>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
