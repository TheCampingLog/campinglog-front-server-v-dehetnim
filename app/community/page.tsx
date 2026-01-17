"use client";

import { useState, Suspense } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import {
  TrendingUp,
  Search,
  X,
  LayoutGrid,
  StretchHorizontal,
  PenLine,
} from "lucide-react";

// ✅ 분리한 컴포넌트와 훅 임포트
import { VibeCard } from "@/features/community/components/VibeCard";
import { useCommunity } from "@/features/community/hooks/useCommunity";

function CommunityContent() {
  const {
    filteredContent,
    isLoading,
    activeTab,
    searchTerm,
    setSearchTerm,
    handleTabClick,
  } = useCommunity("전체");

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="bg-white">
      {/* 1. 히어로 및 검색 섹션 */}
      <section className="pt-32 pb-20 px-6 border-b border-gray-100 bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500 text-white mb-6 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-teal-200">
            <TrendingUp className="w-3 h-3" /> Explore & Share
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tighter">
            Camp Vibe
          </h1>

          <div className="max-w-xl mx-auto relative group mt-10 px-4 sm:px-0">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none z-10">
              <Search className="w-5 h-5 text-teal-600 group-focus-within:text-teal-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="검색어를 입력하세요 (제목, 내용, 작성자)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/90 backdrop-blur-xl border border-teal-100 py-4 pl-14 pr-12 rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-slate-700 shadow-2xl shadow-teal-900/5 placeholder:text-slate-300"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-5 flex items-center text-gray-400 hover:text-teal-600 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. 필터 및 리스트 섹션 */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-gray-100 pb-8 gap-6">
          <div className="flex flex-wrap gap-6 justify-center">
            {["전체", "캠핑장 정보", "캠핑장비 리뷰"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`text-sm font-bold tracking-wide transition-colors relative pb-2 ${
                  activeTab === tab
                    ? "text-teal-700 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-500"
                    : "text-gray-500 hover:text-teal-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* 뷰 모드 토글 */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-teal-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-white text-teal-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <StretchHorizontal className="w-4 h-4" />
              </button>
            </div>

            <Link
              href="/community/write"
              className="group flex items-center gap-3 bg-teal-600 text-white px-6 py-3 rounded-full text-[12px] font-bold uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-200"
            >
              <PenLine className="w-4 h-4" /> Start My Story
            </Link>
          </div>
        </div>

        {/* 3. 콘텐츠 리스트 렌더링 */}
        {isLoading ? (
          <div className="py-40 text-center text-gray-300 font-bold animate-pulse text-2xl font-serif italic">
            Searching Vibe...
          </div>
        ) : filteredContent.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                : "flex flex-col gap-6"
            }
          >
            {filteredContent.map((item: any) => (
              <VibeCard
                key={`${item.type}-${item.postId}`}
                item={item}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          /* 검색 결과 없음 */
          <div className="py-40 text-center">
            <div className="mb-6 inline-flex p-8 bg-slate-50 rounded-full text-slate-200">
              <Search className="w-12 h-12" />
            </div>
            <p className="text-slate-400 font-bold text-xl">
              Search result not found.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 text-teal-600 font-bold border-b-2 border-teal-600 pb-1 hover:text-teal-400 transition-all"
            >
              Clear Search
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-teal-500 font-serif italic">
            Loading Vibes...
          </div>
        }
      >
        <CommunityContent />
      </Suspense>
      <Footer />
    </div>
  );
}
