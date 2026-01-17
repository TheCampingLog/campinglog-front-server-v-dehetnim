"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface EventCategoryNavProps {
  categories: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function EventCategoryNav({
  categories,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}: EventCategoryNavProps) {
  return (
    <section className="sticky top-14 md:top-20 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* 카테고리 탭 리스트 */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/50 rounded-2xl overflow-x-auto no-scrollbar w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveTab(cat);
                  setSearchQuery("");
                }}
                className={`px-5 py-2.5 rounded-xl text-[11px] font-black tracking-widest transition-all whitespace-nowrap ${
                  activeTab === cat
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* 검색창 영역 */}
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search
                className={`w-4 h-4 transition-colors duration-300 ${
                  searchQuery
                    ? "text-teal-500"
                    : "text-slate-300 group-focus-within:text-teal-500"
                }`}
              />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="축제명 또는 지역 입력..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-12 text-[13px] font-medium outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500/20 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-slate-200/50 hover:bg-slate-200 rounded-full transition-all"
              >
                <X className="w-3 h-3 text-slate-500" />
              </button>
            )}
            {/* 하단 강조 라인 */}
            <div
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-teal-500 transition-all duration-500 ease-out ${
                searchQuery || "group-focus-within:w-[90%] w-0"
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
