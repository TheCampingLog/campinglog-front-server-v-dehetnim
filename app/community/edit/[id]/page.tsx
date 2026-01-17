"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Camera, X, ArrowLeft, Star, Sparkles, Check } from "lucide-react";
import { useUserStore } from "@/features/member/store/useUserStore";
import { useCommunityWrite } from "@/features/community/hooks/useCommunityWrite";

export default function PostEditPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.id);
  const { email: currentUserEmail } = useUserStore();

  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 훅 연결 (불러온 데이터를 주입)
  const { form, updateField, handleImageChange, saveContent, isSubmitting } =
    useCommunityWrite(initialData);

  const fetchPostData = useCallback(async () => {
    try {
      const res = await fetch(`/api/community/posts/${postId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();

      // 권한 체크
      if (data.authorEmail !== currentUserEmail) {
        alert("수정 권한이 없습니다.");
        return router.push("/community");
      }
      setInitialData(data);
    } catch {
      router.push("/community");
    } finally {
      setIsLoading(false);
    }
  }, [postId, currentUserEmail, router]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center font-serif italic">
        Syncing with server...
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
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />{" "}
            Discard Changes
          </button>
          <button
            onClick={() => saveContent(postId)}
            disabled={isSubmitting}
            className="bg-teal-600 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-teal-700 shadow-lg transition-all"
          >
            {isSubmitting ? (
              "Updating..."
            ) : (
              <>
                <Check className="inline w-4 h-4 mr-1" /> Save Changes
              </>
            )}
          </button>
        </div>

        {/* 타이틀 편집 */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6 text-teal-600 font-black uppercase text-[10px] tracking-widest">
            <Sparkles className="w-4 h-4" /> Edit Mode
          </div>
          <input
            type="text"
            className="w-full text-4xl md:text-6xl font-black bg-transparent outline-none tracking-tighter"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        {/* 카테고리 & 별점 (기존 UI 유지) */}
        <div className="flex flex-wrap items-center gap-4 mb-12 py-4 border-y border-slate-100">
          <div className="flex gap-2">
            {["정보공유", "후기", "질문", "캠핑장비 리뷰"].map((cat) => (
              <button
                key={cat}
                onClick={() => updateField("category", cat)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                  form.category === cat
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-white border border-slate-100 text-slate-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {form.category === "캠핑장비 리뷰" && (
            <div className="flex items-center gap-3 ml-auto pl-4 border-l border-slate-100">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button key={num} onClick={() => updateField("rating", num)}>
                    <Star
                      className={`w-4 h-4 ${
                        num <= form.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 이미지 수정 영역 (기존 UI 유지) */}
        <div className="mb-12">
          {form.imagePreview ? (
            <div className="group relative aspect-[21/9] w-full rounded-xl overflow-hidden shadow-2xl">
              <img
                src={form.imagePreview}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <label className="p-4 bg-white text-slate-900 rounded-full shadow-xl cursor-pointer hover:scale-110 mr-4">
                  <Camera className="w-6 h-6" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => updateField("imagePreview", null)}
                  className="p-4 bg-white text-red-500 rounded-full shadow-xl hover:scale-110"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full aspect-[21/9] bg-white border-2 border-dashed border-slate-100 rounded-xl cursor-pointer hover:border-teal-200">
              <Camera className="w-8 h-8 text-slate-300 mb-4" />
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                Replace Cover Image
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* 본문 편집 */}
        <textarea
          className="w-full min-h-[500px] bg-transparent outline-none text-xl font-light leading-[2] text-slate-600 resize-none font-serif"
          value={form.content}
          onChange={(e) => updateField("content", e.target.value)}
        />
      </main>
      <Footer />
    </div>
  );
}
