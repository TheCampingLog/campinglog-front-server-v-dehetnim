"use client";

import { use } from "react";
import Image from "next/image";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Share2, Heart } from "lucide-react";
import { useCampingDetail } from "@/features/camping/hooks/useCampingDetail";
import CampingDetailStory from "@/features/camping/components/CampingDetailStory";
import CampingDetailAmenities from "@/features/camping/components/CampingDetailAmenities";
import CampingDetailInfoCard from "@/features/camping/components/CampingDetailInfoCard";

export default function CampingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { site, loading } = useCampingDetail(id);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-teal-600 tracking-widest font-light">
        기록을 불러오는 중입니다...
      </div>
    );
  if (!site)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        존재하지 않는 기록입니다.
      </div>
    );

  return (
    <div className="relative min-h-screen bg-white text-slate-900">
      <Header />
      <main className="relative z-10 pt-32 pb-40">
        <div className="max-w-7xl mx-auto px-6">
          {/* 상단 타이틀 섹션 */}
          <section className="mb-16 border-b border-slate-100 pb-16">
            <div className="flex items-center gap-3 mb-10">
              <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em]">
                Camping Archive No.{id}
              </span>
              <div className="w-10 h-[1px] bg-slate-200" />
              <span className="text-[11px] font-bold text-slate-400">
                {site.induty || "일반야영장"}
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-12">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-slate-900">
                  {site.facltNm}
                </h1>
                <p className="text-xl md:text-2xl font-light text-slate-400 tracking-tight">
                  {site.lineIntro || "자연이 주는 가장 평온한 기록"}
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-full hover:bg-slate-50 transition-all active:scale-95 group">
                  <Heart className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                  <span className="text-xs font-bold text-slate-600">
                    저장하기
                  </span>
                </button>
                <button className="p-3.5 border border-slate-200 rounded-full hover:bg-slate-50 transition-all active:scale-95 group">
                  <Share2 className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors" />
                </button>
              </div>
            </div>
          </section>

          {/* 갤러리 섹션 */}
          <section className="mb-24">
            <div className="relative aspect-[21/9] w-full bg-slate-100 rounded-[3rem] overflow-hidden shadow-sm">
              <Image
                src={site.firstImageUrl || "/image/default-camp.jpg"}
                alt={site.facltNm}
                fill
                priority
                className="object-cover transition-transform duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5" />
            </div>
          </section>

          {/* 메인 상세 정보 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            <div className="lg:col-span-8 space-y-24">
              <CampingDetailStory intro={site.intro} />
              <CampingDetailAmenities sbrsCl={site.sbrsCl} />
            </div>
            <CampingDetailInfoCard site={site} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
