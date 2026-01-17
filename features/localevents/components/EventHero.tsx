"use client";

import React from "react";
import Image from "next/image";

export default function EventHero() {
  return (
    <section className="relative bg-white pt-32 pb-16 overflow-hidden border-b border-slate-50">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* 배경 장식 텍스트 */}
        <div className="absolute top-0 left-6 text-[18vw] font-black text-slate-50 leading-none select-none tracking-tighter -z-10 animate-pulse">
          2026
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-16">
          {/* 좌측: 텍스트 정보 */}
          <div className="lg:w-1/3 pt-10">
            <div className="flex items-center gap-3 mb-10">
              <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                Special Edition
              </span>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                Issue No. 04
              </span>
            </div>
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.8] italic font-serif text-slate-900 mb-12">
              Local <br /> <span className="text-teal-500">Vibes.</span>
            </h1>
            <div className="space-y-6 max-w-xs">
              <p className="text-slate-500 font-normal leading-relaxed text-base">
                전국의 숨겨진 보석 같은 축제들을 큐레이션했습니다. 캠핑장의 밤을
                더욱 풍성하게 채워줄 로컬 스토리.
              </p>
              <div className="h-[1px] w-20 bg-teal-500" />
            </div>
          </div>

          {/* 우측: 겹쳐진 히로 이미지 영역 */}
          <div className="lg:w-2/3 relative w-full h-[500px] md:h-[600px] mt-12 lg:mt-0">
            {/* 첫 번째 이미지 (상단 배치) */}
            <div className="absolute top-0 left-0 w-[60%] h-[75%] z-20 group">
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white">
                <Image
                  src="/image/localevent-hero-1.jpg"
                  alt="Film 1"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  priority
                />
              </div>
            </div>
            {/* 두 번째 이미지 (하단 겹침) */}
            <div className="absolute top-[20%] right-[-5%] w-[58%] h-[68%] z-10 group transition-all duration-1000 delay-300">
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.15)] border-[10px] border-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-3">
                <Image
                  src="/image/localevent-hero-2.jpg"
                  alt="Film 2"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
