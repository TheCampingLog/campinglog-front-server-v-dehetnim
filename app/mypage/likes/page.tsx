"use client";

import { useEffect, useState, useCallback } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Sidebar from "@/features/member/components/common/Sidebar";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, Sparkles, ArrowUpRight } from "lucide-react";
import { useUserStore } from "@/features/member/store/useUserStore";

interface LikedItem {
  postId: number;
  title: string;
  category: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  image: string;
  content: string;
}

export default function MyLikesPage() {
  const [likedList, setLikedList] = useState<LikedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { email } = useUserStore(); // ✅ 닉네임 대신 고유 식별자인 email을 사용

  // ✅ 경로를 /api/members/likes로 수정 (정의된 위치에 맞게)
  const fetchLikedContent = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/members/likes`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        // 최신순 정렬 (ID가 큰 순서대로)
        const sortedData = data.sort(
          (a: LikedItem, b: LikedItem) => b.postId - a.postId
        );
        setLikedList(sortedData);
      }
    } catch (error) {
      console.error("좋아요 목록 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 유저 정보(email)가 있을 때만 호출
    if (email) fetchLikedContent();
  }, [email, fetchLikedContent]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[1px] bg-slate-900" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Curated Vibe
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter italic font-serif">
            Saved Vibes
          </h1>
        </header>

        <div className="mb-20">
          <Sidebar />
        </div>

        <div className="flex items-center justify-between mb-12 pb-6 border-b-2 border-slate-900">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-serif italic">
              {likedList.length}
            </span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              Inspiration Pieces
            </span>
          </div>
          <Sparkles className="w-5 h-5 text-teal-400" />
        </div>

        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="py-40 text-center font-serif italic text-slate-300 animate-pulse text-xl">
              Opening your private collection...
            </div>
          ) : likedList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {likedList.map((item) => (
                <Link
                  key={`liked-${item.postId}`}
                  href={
                    item.category === "캠핑장비 리뷰"
                      ? `/community/reviews/${item.postId}`
                      : `/community/posts/${item.postId}`
                  }
                  className="group block relative bg-white border border-slate-50 rounded-[2.5rem] p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-700"
                >
                  <div className="flex flex-col gap-6">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.8rem] bg-slate-100 shadow-sm">
                      <Image
                        src={item.image || "/image/default-camp.jpg"}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-white/20">
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="text-[9px] font-black text-white bg-slate-900/40 backdrop-blur-md px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="px-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                          {item.createdAt}
                        </span>
                        <div className="flex items-center gap-3 text-slate-300">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">
                              {item.viewCount || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tighter group-hover:text-teal-600 transition-colors line-clamp-2">
                        {item.title}
                      </h2>

                      <p className="text-sm text-slate-500 font-light line-clamp-2 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                        {item.content}
                      </p>

                      <div className="pt-4 flex justify-end">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">
                Your mood board is empty.
              </p>
              <Link
                href="/community"
                className="inline-flex items-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-teal-600 transition-all shadow-xl shadow-slate-200"
              >
                Find New Vibes
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
