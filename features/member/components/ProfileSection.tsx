"use client";

import { Sparkles, ArrowUpRight, Award } from "lucide-react";
import Image from "next/image";

interface ProfileSectionProps {
  previewImage: string;
  nickname: string;
  memberGrade: string;
  rank?: {
    currentRank?: string;
    nextRank?: string;
    totalPoints?: number;
    remainPoints?: number;
  };
}

export function ProfileSection({
  previewImage,
  nickname,
  memberGrade,
  rank,
}: ProfileSectionProps) {
  // ✅ 등급 퍼센트 계산 로직 (NaN 방지)
  const currentPoints = rank?.totalPoints || 0;
  const remaining = rank?.remainPoints || 0;
  const total = currentPoints + remaining;
  const progress = total > 0 ? (currentPoints / total) * 100 : 0;

  // ✅ 이미지 최적화 예외 처리 판단 (Base64 대응)
  const isBase64 = previewImage?.startsWith("data:");

  return (
    <div className="flex flex-col items-center py-12 bg-white rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.03)] border border-slate-50 relative overflow-hidden group h-full">
      {/* 배경 장식 스파클링 아이콘 */}
      <div className="absolute -top-6 -right-6 opacity-[0.05] text-slate-900 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none">
        <Sparkles className="w-32 h-32" />
      </div>

      {/* 프로필 이미지 박스 */}
      <div className="relative mb-8">
        <div className="relative w-36 h-36 rounded-[2.8rem] bg-slate-100 overflow-hidden border-[6px] border-white shadow-2xl rotate-2 group-hover:rotate-0 transition-all duration-700">
          <Image
            src={previewImage || "/image/default-profile.png"}
            alt={`${nickname}'s Profile`}
            fill
            sizes="144px"
            priority
            // ✅ Base64 이미지일 경우 최적화 기능을 끔 (에러 방지)
            unoptimized={isBase64}
            className="object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
          />
        </div>

        {/* 등급 배지 플로팅 */}
        <div className="absolute -bottom-1 -right-1 bg-teal-600 text-white p-2 rounded-2xl shadow-xl border-4 border-white z-10 transition-transform duration-500 group-hover:scale-110">
          <Award className="w-4 h-4" />
        </div>
      </div>

      {/* 텍스트 정보 */}
      <div className="text-center px-8 w-full">
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-tight mb-1">
          {nickname || "Guest"}
        </h2>
        <p className="text-[10px] font-bold text-teal-600 uppercase tracking-[0.3em] mb-10">
          {rank?.currentRank || memberGrade || "Beginner"} level
        </p>

        {/* 등급 진행 상황 카드 */}
        <div className="w-full bg-slate-50/80 backdrop-blur-sm p-6 rounded-[2.2rem] border border-slate-100/50">
          <div className="flex justify-between items-end mb-4 px-1">
            <div className="text-left">
              <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mb-1">
                Exp.
              </p>
              <p className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">
                {currentPoints.toLocaleString()} pt
              </p>
            </div>
            <div className="text-right font-serif italic text-slate-400 text-[10px]">
              Next: {rank?.nextRank || "Master"}
            </div>
          </div>

          {/* 게이지 바 */}
          <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-slate-100 p-[1.5px]">
            <div
              className="h-full bg-slate-900 transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 flex justify-center">
            <span className="text-[9px] font-bold text-slate-400 tracking-tight">
              다음 등급까지{" "}
              <span className="text-slate-900 font-black">
                {remaining.toLocaleString()}P
              </span>
            </span>
          </div>
        </div>

        {/* 하단 상세 버튼 */}
        <button className="mt-10 group flex items-center gap-2 mx-auto text-[10px] font-bold text-slate-300 hover:text-slate-900 transition-all uppercase tracking-[0.2em] outline-none focus:ring-2 focus:ring-slate-100 rounded-lg p-1">
          Level Benefits
          <ArrowUpRight className="w-3 h-3 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
