"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Sidebar from "@/features/member/components/common/Sidebar";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ✅ 분리한 컴포넌트와 훅을 임포트합니다.
import { ReviewCard } from "@/features/member/components/ReviewCard";
import { useMyReviews } from "@/features/member/hooks/useMyReviews";

export default function MemberReviewsPage() {
  // ✅ 커스텀 훅을 통해 리뷰 데이터와 제어 로직을 가져옵니다.
  const {
    reviews,
    isLoading,
    currentPage,
    totalPages,
    totalElements,
    fetchReviews,
    handleDelete,
  } = useMyReviews();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        {/* 헤더 섹션 */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[1px] bg-slate-900" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Expert Feedback
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter italic font-serif">
            Gear Reviews
          </h1>
        </header>

        <div className="mb-20">
          <Sidebar />
        </div>

        {/* 요약 바 */}
        <div className="flex items-center justify-between mb-12 pb-6 border-b-2 border-slate-900">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-serif italic">
              {totalElements}
            </span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              Items Evaluated
            </span>
          </div>
          <p className="hidden md:block text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Your honest opinion helps other campers.
          </p>
        </div>

        {/* 리뷰 콘텐츠 영역 */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="py-40 text-center font-serif italic text-slate-300 animate-pulse text-xl">
              Loading your gear records...
            </div>
          ) : reviews.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-8">
                {reviews.map((review) => (
                  // ✅ 분리한 ReviewCard 컴포넌트에 데이터와 삭제 함수를 전달합니다.
                  <ReviewCard
                    key={`review-${review.postId}`}
                    review={review}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* 페이지네이션 버튼 */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-4">
                  <button
                    onClick={() => fetchReviews(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-100 rounded-full disabled:opacity-20 hover:bg-slate-50 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => fetchReviews(i + 1)}
                        className={`w-8 h-8 rounded-full text-[11px] font-black transition-all ${
                          currentPage === i + 1
                            ? "bg-slate-900 text-white"
                            : "text-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => fetchReviews(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-slate-100 rounded-full disabled:opacity-20 hover:bg-slate-50 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* 빈 데이터 UI */
            <div className="py-40 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">
                Your gear archive is empty.
              </p>
              <Link
                href="/community?tab=캠핑장비%20리뷰"
                className="inline-flex items-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-teal-600 transition-all shadow-xl shadow-slate-200"
              >
                Go to Review Gear
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
