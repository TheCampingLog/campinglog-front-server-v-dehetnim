"use client";

import React from "react";
import CampingCard from "./CampingCard";
import { CampingSite } from "@/types/camping";

interface CampingListGridProps {
  loading: boolean;
  items: CampingSite[];
}

export default function CampingListGrid({
  loading,
  items,
}: CampingListGridProps) {
  // 로딩 중일 때 보여주는 스켈레톤 UI
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-[4/5] bg-slate-100 rounded-[3rem] animate-pulse"
          />
        ))}
      </div>
    );
  }

  // 검색 결과가 없을 때
  if (items.length === 0) {
    return (
      <div className="col-span-full py-40 text-center font-serif italic text-3xl text-slate-300 border-t border-slate-50 pt-20">
        검색 결과가 없습니다.
      </div>
    );
  }

  // 정상 데이터 리스트 출력
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-24">
      {items.map((site, index) => (
        <div
          key={site.contentId || index}
          className="group opacity-0 animate-[reveal_0.8s_forwards]"
          style={{ animationDelay: `${(index % 9) * 100}ms` }}
        >
          <div className="transition-transform duration-500 group-hover:-translate-y-3">
            <CampingCard {...site} />
          </div>
        </div>
      ))}
    </div>
  );
}
