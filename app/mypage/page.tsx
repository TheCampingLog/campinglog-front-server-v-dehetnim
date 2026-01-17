"use client";

import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Sidebar from "@/features/member/components/common/Sidebar";
import { ProfileSection } from "@/features/member/components/ProfileSection";
import { ActivitySummary } from "@/features/member/components/ActivitySummary";
import { useMemberData } from "@/features/member/hooks/useMemberData"; // ✅ 통합 훅 사용

export default function Mypage() {
  const [isMounted, setIsMounted] = useState(false);

  // ✅ 우리가 만든 통합 훅을 사용합니다.
  // 이 훅 안에서 이미 '/api/members/account' 호출과 'Zustand 동기화'가 모두 일어납/니다.
  const { member, rank, isLoading } = useMemberData();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hydration 에러 방지
  if (!isMounted) return null;

  // 로딩 뷰
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-[1px] bg-slate-900 animate-pulse" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Syncing Studio...
          </p>
        </div>
      </div>
    );
  }

  // 데이터 없을 때 안전장치
  if (!member) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">데이터를 불러오지 못했습니다.</p>
          <button
            onClick={() => window.location.reload()}
            className="text-[10px] font-bold border-b border-slate-900 pb-1"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        {/* 타이틀 영역 */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[1px] bg-slate-900" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Personal Space
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter italic font-serif">
            My Studio
          </h1>
        </header>

        <div className="mb-20">
          <Sidebar />
        </div>

        <div className="flex items-center justify-between mb-12 pb-4 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-teal-500 rounded-full" />
            <p className="text-lg font-black tracking-tighter uppercase italic">
              Dashboard Summary
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-stretch">
          <div className="lg:col-span-5 xl:col-span-4 h-full">
            <div className="h-full transform transition-transform hover:-translate-y-1 duration-700">
              <ProfileSection
                previewImage={member.profileImage} // ✅ 실제 데이터 연결
                nickname={member.nickname} // ✅ 실제 데이터 연결
                memberGrade={member.memberGrade} // ✅ 실제 데이터 연결
                rank={
                  rank || {
                    // ✅ 실제 랭크 데이터 연결
                    currentRank: "Professional",
                    nextRank: "Master",
                    totalPoints: 0,
                    remainPoints: 1000,
                  }
                }
              />
            </div>
          </div>
          <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
            <div className="w-[1px] h-48 bg-slate-100" />
          </div>
          <div className="lg:col-span-6 xl:col-span-7 bg-slate-50/50 rounded-[3rem] p-10 border border-slate-100/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-700">
            <ActivitySummary />
          </div>
        </div>
        <div className="mt-32 border-t border-slate-50" />
      </main>
      <Footer />
    </div>
  );
}
