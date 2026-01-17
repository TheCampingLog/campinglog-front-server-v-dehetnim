"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Sidebar from "@/features/member/components/common/Sidebar";
import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

// ✅ 새로 만든 컴포넌트와 훅을 임포트합니다.
import { PostCard } from "@/features/member/components/PostCard";
import { useMyPosts } from "@/features/member/hooks/useMyPosts";

export default function MyPostsPage() {
  // ✅ 훅을 통해 모든 상태와 로직을 한 번에 가져옵니다.
  const {
    posts,
    isLoading,
    currentPage,
    totalPages,
    totalElements,
    fetchPosts,
    handleDelete,
  } = useMyPosts();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        {/* 헤더 섹션 */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[1px] bg-slate-900" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Personal Archive
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter italic font-serif">
            My Stories
          </h1>
        </header>

        <div className="mb-20">
          <Sidebar />
        </div>

        {/* 필터 요약 바 */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-serif italic">
              {totalElements}
            </span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              Stories Written
            </span>
          </div>
          <Link
            href="/community/write"
            className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-teal-600 hover:text-teal-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Write New
          </Link>
        </div>

        {/* 게시글 목록 영역 */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="py-40 text-center font-serif italic text-slate-300 animate-pulse text-xl">
              Syncing your archive...
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="space-y-4">
                {posts.map((post) => (
                  // ✅ 분리한 PostCard 컴포넌트를 사용합니다.
                  <PostCard
                    key={`post-item-${post.postId}`}
                    post={post}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* 페이지네이션 컨트롤 */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-4">
                  <button
                    onClick={() => fetchPosts(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-100 rounded-full disabled:opacity-20 hover:bg-slate-50 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={`page-${i + 1}`}
                        onClick={() => fetchPosts(i + 1)}
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
                    onClick={() => fetchPosts(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-slate-100 rounded-full disabled:opacity-20 hover:bg-slate-50 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* 데이터 없음 UI */
            <div className="py-40 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">
                No stories archived yet.
              </p>
              <Link
                href="/community/write"
                className="inline-flex items-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-teal-600 transition-all shadow-xl shadow-slate-200"
              >
                <Plus className="w-4 h-4" /> Start a New Record
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
