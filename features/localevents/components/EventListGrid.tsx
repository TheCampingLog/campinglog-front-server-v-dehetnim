"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";
import EventCard from "./EventCard";

interface EventListGridProps {
  isLoading: boolean;
  filteredEvents: any[];
  onEventSelect: (event: any) => void;
}

export default function EventListGrid({
  isLoading,
  filteredEvents,
  onEventSelect,
}: EventListGridProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 pb-40">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
        {isLoading ? (
          // 로딩 스켈레톤 UI
          [...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-5 animate-pulse">
              <div className="aspect-[3/4] bg-slate-100 rounded-[2.5rem]" />
              <div className="h-4 w-1/3 bg-slate-100 rounded-lg" />
              <div className="h-8 w-full bg-slate-100 rounded-lg" />
            </div>
          ))
        ) : filteredEvents.length > 0 ? (
          // 실제 이벤트 카드 리스트
          filteredEvents.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              onClick={onEventSelect}
            />
          ))
        ) : (
          // 결과 없음 UI
          <div className="col-span-full py-40 text-center animate-in fade-in zoom-in">
            <div className="inline-flex p-6 rounded-full bg-slate-50 mb-6">
              <SlidersHorizontal className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold text-xl">
              검색 결과가 없습니다.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
