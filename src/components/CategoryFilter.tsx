'use client';

import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

type CategoryFilterProps = {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
};

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const allCategories = [{ id: 'all-cat', name: 'All', icon: categories[0]?.icon }, ...categories];

  return (
    <div className="mb-8">
      <div className="flex space-x-3 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.name)}
            className={cn(
              "flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-lg transition-all duration-200 border-2",
              selectedCategory === category.name
                ? "bg-primary/10 text-primary border-primary"
                : "bg-card hover:bg-muted border-transparent"
            )}
          >
            <category.icon className="h-8 w-8 mb-1" />
            <span className="text-xs font-medium text-center">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
