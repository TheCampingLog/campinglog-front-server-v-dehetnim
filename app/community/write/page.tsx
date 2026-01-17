"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Camera, X, ArrowLeft, Star, Sparkles, Check } from "lucide-react";
import { useCommunityWrite } from "@/features/community/hooks/useCommunityWrite";

export default function PostWritePage() {
  const router = useRouter();
  const { form, updateField, handleImageChange, saveContent, isSubmitting } =
    useCommunityWrite();

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-slate-900">
      <Header />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        {/* 상단 액션 바 */}
        <div className="flex items-center justify-between mb-16">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />{" "}
            Close
          </button>
          <div className="flex items-center gap-6">
            {/* ✅ 수정된 확인 버튼 디자인 */}
            <button
              onClick={() => saveContent()}
              disabled={isSubmitting}
              className={`group flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg ${
                isSubmitting
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-100 active:scale-95"
              }`}
            >
              {isSubmitting ? (
                "Publishing..."
              ) : (
                <>
                  <Check className="w-4 h-4" /> Publish Content
                </>
              )}
            </button>
          </div>
        </div>

        {/* 타이틀 영역 */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-600">
              New Community Post
            </span>
          </div>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            className="w-full text-4xl md:text-6xl font-black bg-transparent outline-none placeholder:text-slate-200 tracking-tighter"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        {/* 카테고리 & 별점 선택 */}
        <div className="flex flex-wrap items-center gap-4 mb-12 py-4 border-y border-slate-100">
          <div className="flex gap-2">
            {["정보공유", "후기", "질문", "캠핑장비 리뷰", "캠핑장 정보"].map(
              (cat) => (
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
              )
            )}
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

        {/* 이미지 업로드 */}
        <div className="mb-12">
          {form.imagePreview ? (
            <div className="group relative aspect-[21/9] w-full rounded-xl overflow-hidden shadow-2xl">
              <img
                src={form.imagePreview}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => updateField("imagePreview", null)}
                  className="p-4 bg-white text-slate-900 rounded-full shadow-xl"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full aspect-[21/9] bg-white border-2 border-dashed border-slate-100 rounded-xl cursor-pointer hover:border-teal-200 transition-all">
              <Camera className="w-8 h-8 text-slate-300 mb-4" />
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                Add a Cover Image
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

        {/* 본문 텍스트 영역 */}
        <div className="min-h-[500px]">
          <textarea
            placeholder="캠핑 이야기를 들려주세요..."
            className="w-full h-full min-h-[500px] bg-transparent outline-none text-xl font-light leading-[2] text-slate-600 placeholder:text-slate-200 resize-none font-serif"
            value={form.content}
            onChange={(e) => updateField("content", e.target.value)}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
