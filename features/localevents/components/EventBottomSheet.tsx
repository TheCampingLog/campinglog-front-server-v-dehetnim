"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Calendar, Info, Navigation } from "lucide-react";

interface EventBottomSheetProps {
  selectedEvent: any;
  onClose: () => void;
}

export default function EventBottomSheet({
  selectedEvent,
  onClose,
}: EventBottomSheetProps) {
  return (
    <aside
      className={`fixed bottom-0 left-0 w-full bg-white z-[110] rounded-t-[3.5rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)] transition-transform duration-700 cubic-bezier(0.32, 0.72, 0, 1) transform ${
        selectedEvent ? "translate-y-0" : "translate-y-full"
      } h-[92vh] overflow-hidden`}
    >
      {selectedEvent && (
        <div className="h-full flex flex-col relative">
          {/* 드래그 핸들 디자인 (클릭 시 닫기) */}
          <div
            className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-slate-200 rounded-full z-20 cursor-pointer"
            onClick={onClose}
          />

          <div className="flex-1 overflow-y-auto no-scrollbar p-10 md:p-16">
            <div className="flex flex-col md:flex-row gap-16 max-w-7xl mx-auto h-full items-center">
              {/* 이미지 영역 */}
              <div className="relative w-full md:w-1/2 aspect-square rounded-[3.5rem] overflow-hidden shadow-2xl">
                <Image
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* 정보 영역 */}
              <div className="flex-1 space-y-10 py-6 text-left">
                <div>
                  <span className="text-teal-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
                    {selectedEvent.category}
                  </span>
                  <h2 className="text-5xl lg:text-6xl font-black leading-none tracking-tighter text-slate-900">
                    {selectedEvent.title}
                  </h2>
                </div>

                {/* 일시 및 장소 그리드 */}
                <div className="grid grid-cols-1 gap-6 border-y border-slate-100 py-10">
                  <div className="flex items-center gap-5 text-slate-900">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-teal-500">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg">
                      {selectedEvent.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-5 text-slate-900">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-teal-500">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg">
                      {selectedEvent.location}
                    </span>
                  </div>
                </div>

                {/* 상세 설명 */}
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-teal-500" /> Archive
                    Description
                  </h4>
                  <p className="text-slate-500 font-normal leading-relaxed text-lg max-w-2xl">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* 길찾기 버튼 */}
                <button className="w-full py-6 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest hover:bg-teal-600 transition-all flex items-center justify-center gap-3 shadow-xl">
                  Open Navigation <Navigation className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
