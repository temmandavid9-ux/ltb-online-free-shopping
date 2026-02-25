'use client';

import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

type CategoryFilterProps = {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
};

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-4 no-scrollbar">
        <button
          onClick={() => onSelectCategory('All')}
          className={cn(
            "flex-shrink-0 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border",
            selectedCategory === 'All'
              ? "bg-foreground text-background border-foreground"
              : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
          )}
        >
          All Collections
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.name)}
            className={cn(
              "flex-shrink-0 flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border",
              selectedCategory === category.name
                ? "bg-foreground text-background border-foreground shadow-lg shadow-black/5"
                : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
            )}
          >
            <category.icon className="h-3.5 w-3.5" />
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}