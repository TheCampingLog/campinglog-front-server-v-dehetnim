"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import {
  Camera,
  X,
  ArrowLeft,
  Star,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";
import { useUserStore } from "@/features/member/store/useUserStore";
import { useCommunityWrite } from "@/features/community/hooks/useCommunityWrite";

export default function PostEditPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.id);
  const { email: currentUserEmail, isLoggedIn } = useUserStore();

  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 훅에 로드된 데이터를 주입합니다.
  const { form, updateField, handleImageChange, saveContent, isSubmitting } =
    useCommunityWrite(initialData);

  const fetchPostData = useCallback(async () => {
    if (!postId) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/community/posts/${postId}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        alert("게시글을 찾을 수 없습니다.");
        return router.push("/community");
      }

      const data = await res.json();

      // 🔐 인가(Authorization) 체크: 작성자 이메일과 로그인 유저 이메일 대조
      // 자바의 SecurityContextHolder 체크와 유사합니다.
      if (data.authorEmail?.toLowerCase() !== currentUserEmail?.toLowerCase()) {
        alert("수정 권한이 없습니다.");
        return router.push("/community");
      }

      setInitialData(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      router.push("/community");
    } finally {
      setIsLoading(false);
    }
  }, [postId, currentUserEmail, router]);

  useEffect(() => {
    // 🚀 로그인 정보가 로드된 후에 데이터를 가져오도록 순서 조정
    if (isLoggedIn && currentUserEmail) {
      fetchPostData();
    }
  }, [isLoggedIn, currentUserEmail, fetchPostData]);

  // 로딩 뷰 (자바의 Progress Dialogue)
  if (isLoading || !initialData)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-4" />
        <p className="font-serif italic text-slate-400">
          Syncing with server...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-slate-900">
      <Header />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        {/* 상단 컨트롤러 */}
        <div className="flex items-center justify-between mb-16">
          <button
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Discard Changes
          </button>

          <button
            onClick={() => saveContent(postId)}
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg ${
              isSubmitting
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-teal-600 text-white hover:bg-teal-700 active:scale-95 shadow-teal-100"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>

        {/* 타이틀 편집 영역 */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6 text-teal-600 font-black uppercase text-[10px] tracking-widest">
            <Sparkles className="w-4 h-4" /> Edit Mode
          </div>
          <input
            type="text"
            className="w-full text-4xl md:text-6xl font-black bg-transparent outline-none tracking-tighter placeholder:text-slate-200 border-none focus:ring-0"
            placeholder="제목을 입력하세요"
            value={form.title}
            disabled={isSubmitting}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        {/* 카테고리 & 별점 선택 */}
        <div className="flex flex-wrap items-center gap-4 mb-12 py-4 border-y border-slate-100">
          <div className="flex flex-wrap gap-2">
            {["정보공유", "후기", "질문", "캠핑장비 리뷰", "캠핑장 정보"].map(
              (cat) => (
                <button
                  key={cat}
                  disabled={isSubmitting}
                  onClick={() => updateField("category", cat)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                    form.category === cat
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white border border-slate-100 text-slate-400"
                  } disabled:opacity-50`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {form.category === "캠핑장비 리뷰" && (
            <div className="flex items-center gap-3 ml-auto pl-4 border-l border-slate-100">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => updateField("rating", num)}
                    disabled={isSubmitting}
                  >
                    <Star
                      className={`w-4 h-4 transition-colors ${
                        num <= form.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-200 hover:text-amber-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 이미지 수정 영역 */}
        <div className="mb-12">
          {form.imageUrl ? (
            <div className="group relative aspect-[21/9] w-full rounded-xl overflow-hidden shadow-2xl bg-slate-100">
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-4">
                <label className="p-4 bg-white text-slate-900 rounded-full shadow-xl cursor-pointer hover:scale-110 transition-transform disabled:opacity-50">
                  <Camera className="w-6 h-6" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    disabled={isSubmitting}
                    onChange={handleImageChange}
                  />
                </label>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => updateField("imageUrl", "")}
                  className="p-4 bg-white text-red-500 rounded-full shadow-xl hover:scale-110 transition-transform disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          ) : (
            <label
              className={`flex flex-col items-center justify-center w-full aspect-[21/9] bg-white border-2 border-dashed border-slate-100 rounded-xl transition-all ${
                isSubmitting
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:border-teal-200"
              }`}
            >
              <Camera className="w-8 h-8 text-slate-300 mb-4" />
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                Replace Cover Image
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                disabled={isSubmitting}
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* 본문 텍스트 영역 */}
        <div className="min-h-[500px]">
          <textarea
            placeholder="캠핑 이야기를 들려주세요..."
            className="w-full h-full min-h-[500px] bg-transparent outline-none text-xl font-light leading-relaxed text-slate-600 resize-none font-serif focus:ring-0 border-none"
            value={form.content}
            disabled={isSubmitting}
            onChange={(e) => updateField("content", e.target.value)}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
