"use client";

import React from "react";
import { Search, RotateCcw } from "lucide-react";

interface CampingFilterBarProps {
  total: number;
  filterDo: string;
  filterSi: string;
  keyword: string;
  doList: string[];
  sigunguList: string[];
  onDoChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSiChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onKeywordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export default function CampingFilterBar({
  total,
  filterDo,
  filterSi,
  keyword,
  doList,
  sigunguList,
  onDoChange,
  onSiChange,
  onKeywordChange,
  onReset,
}: CampingFilterBarProps) {
  return (
    <div className="flex flex-wrap items-stretch min-h-[64px] bg-white border border-slate-900 rounded-full mb-16 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
      {/* 시그니처 초록색 배지 */}
      <div className="bg-teal-500 text-white px-8 flex items-center justify-center border-r border-slate-900">
        <span className="text-[10px] font-black tracking-widest mr-3 opacity-80">
          전체
        </span>
        <span className="font-serif italic text-xl font-bold leading-none">
          {total}
        </span>
      </div>

      {/* 도 선택 */}
      <div className="relative border-r border-slate-100 flex-1 min-w-[150px]">
        <select
          value={filterDo}
          onChange={onDoChange}
          className="w-full h-full pl-8 pr-10 text-[13px] font-black text-slate-800 outline-none appearance-none bg-transparent cursor-pointer"
        >
          <option value="">모든 지역(도)</option>
          {doList.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[8px]">
          ▼
        </div>
      </div>

      {/* 시군구 선택 */}
      <div className="relative border-r border-slate-100 flex-1 min-w-[180px]">
        <select
          disabled={!filterDo}
          value={filterSi}
          onChange={onSiChange}
          className="w-full h-full pl-8 pr-10 text-[13px] font-black text-slate-800 outline-none appearance-none bg-transparent cursor-pointer disabled:opacity-30"
        >
          <option value="">시/군/구 전체</option>
          {sigunguList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[8px]">
          ▼
        </div>
      </div>

      {/* 검색창 */}
      <div className="relative flex-[2.5] min-w-[300px] flex items-center group">
        <Search className="absolute left-7 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
        <input
          type="text"
          value={keyword}
          onChange={onKeywordChange}
          placeholder="캠핑장 이름이나 주소를 입력하세요..."
          className="w-full h-full pl-14 pr-8 text-[14px] font-medium outline-none placeholder:text-slate-300 placeholder:italic"
        />
      </div>

      {/* 초기화 버튼 */}
      {(filterDo || filterSi || keyword) && (
        <button
          onClick={onReset}
          className="px-8 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all border-l border-slate-100 flex items-center gap-2 group"
        >
          <span className="text-[10px] font-black tracking-tighter">
            초기화
          </span>
          <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-180deg] transition-transform duration-500" />
        </button>
      )}
    </div>
  );
}
