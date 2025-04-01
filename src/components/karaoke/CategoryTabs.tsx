// src/components/karaoke/CategoryTabs.tsx
"use client";

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryTabs({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryTabsProps) {
  return (
    <div className="category-tabs-container">
      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`category-button ${selectedCategory === category ? 'selected' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}