"use client";

import React from "react";
import CampingMap from "./CampingMap";

interface CampingHeroProps {
  displayTitle: string;
  phrase: string;
  selectedRegion: string;
  onRegionClick: (regionId: string) => void;
}

export default function CampingHero({
  displayTitle,
  phrase,
  selectedRegion,
  onRegionClick,
}: CampingHeroProps) {
  return (
    <section className="relative w-full max-w-5xl bg-white pt-24 pb-4 overflow-hidden">
      <div className="px-6 relative">
        <div className="grid lg:grid-cols-2 gap-2 items-center">
          <div className="z-10 relative">
            <div className="w-16 h-[2px] bg-teal-500 mb-8" />
            <h1 className="text-8xl md:text-[110px] font-black tracking-tighter text-slate-900 mb-6 leading-[0.85]">
              {displayTitle === "전체" ? "National" : displayTitle} <br />
              <span className="text-teal-500 font-serif italic font-light">
                Archive.
              </span>
            </h1>
            <div className="flex items-center gap-5 mt-10">
              <div className="h-10 w-[1.5px] bg-slate-900" />
              <p className="text-slate-500 text-sm font-semibold leading-relaxed max-w-xs tracking-tight">
                {phrase} <br />
                <span className="text-slate-900 font-bold">
                  다음 여정을 계획해보세요
                </span>
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-teal-50/50 rounded-full blur-3xl -z-10 opacity-60" />
            <div className="w-full max-w-[420px]">
              <CampingMap
                onRegionClick={onRegionClick}
                selectedRegion={selectedRegion}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
