"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import TipsHero from "@/features/tips/components/TipsHero";
import TipsCategoryNav from "@/features/tips/components/TipsCategoryNav";
import TipsListGrid from "@/features/tips/components/TipsListGrid";
import { useTipsData } from "@/features/tips/hooks/useTipsData";

const CATEGORIES = ["ALL", "Equipment", "Manner", "Recipe", "Car Camping"];

export default function CampingTipsPage() {
  const { filteredTips, selectedCategory, setSelectedCategory, isLoading } =
    useTipsData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-slate-400 animate-pulse font-serif italic">
          Loading Magazine...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        <TipsHero />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <TipsCategoryNav
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <TipsListGrid tips={filteredTips} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
