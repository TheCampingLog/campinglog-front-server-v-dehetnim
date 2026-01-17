"use client";

import React from "react";

interface TipsCategoryNavProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function TipsCategoryNav({
  categories,
  selectedCategory,
  onSelectCategory,
}: TipsCategoryNavProps) {
  return (
    <div className="flex flex-wrap gap-8 mb-20 justify-center border-b border-slate-100 pb-8">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`text-xs font-bold tracking-[0.2em] uppercase transition-all relative pb-2 ${
            selectedCategory === cat
              ? "text-slate-900 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-slate-900"
              : "text-slate-300 hover:text-slate-500"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
