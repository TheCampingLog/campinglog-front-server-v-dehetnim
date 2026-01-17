"use client";

import { useEffect } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Sidebar from "@/features/member/components/common/Sidebar";
import { AccountSection } from "@/features/member/components/AccountSection";
import { useProfileEdit } from "@/features/member/hooks/useProfileEdit";
import { useUserStore } from "@/features/member/store/useUserStore";
import { useMemberData } from "@/features/member/hooks/useMemberData";

/**
 * 1. 메인 페이지 컴포넌트 (데이터 로딩 대기)
 */
export default function AccountPage() {
  const { member, isLoading } = useMemberData();

  // ✅ 데이터 로딩 중 스켈레톤/로딩 뷰
  if (isLoading || !member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-[1px] bg-slate-900 animate-pulse" />
          <p className="font-serif italic text-slate-400 text-[10px] tracking-[0.3em] uppercase">
            Synchronizing Identity...
          </p>
        </div>
      </div>
    );
  }

  // 데이터 로드 완료 후 실제 콘텐츠 컴포넌트 호출
  return <AccountContent member={member} />;
}

/**
 * 2. 실제 화면 로직 컴포넌트
 */
function AccountContent({ member }: { member: any }) {
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  // ✅ 통합된 useProfileEdit 훅 사용 (이미지 처리 및 상태 관리 통합)
  const profile = useProfileEdit(
    member.nickname || "",
    member.phoneNumber || "",
    member.profileImage || "/image/default-profile.png",
    member.email || ""
  );

  // 페이지 진입 시 전역 스토어와 데이터 동기화
  useEffect(() => {
    if (member) {
      setUserInfo({
        nickname: member.nickname,
        profileImage: member.profileImage,
        email: member.email,
      });
    }
  }, [member, setUserInfo]);

  /**
   * 서버에 변경사항 저장 핸들러
   */
  const handleSave = async () => {
    try {
      // ✅ 서버 API 호출 (닉네임, 연락처, 이미지 포함)
      const response = await fetch("/api/members/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: profile.tempNickname,
          phoneNumber: profile.tempPhoneNumber,
          profileImage: profile.previewImage,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // 1. 로컬 훅 상태를 '원본'으로 확정
        profile.saveEdit();

        // 2. 전역 스토어 업데이트 (헤더/사이드바 즉시 반영)
        setUserInfo({
          nickname: result.user.nickname,
          profileImage: result.user.profileImage,
          email: member.email,
        });

        alert("성공적으로 변경되었습니다.");
      } else {
        alert(result.error || "수정 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        {/* 매거진 스타일 헤더 */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[1px] bg-slate-900" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Security & Profile
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter italic font-serif">
            Account Setup
          </h1>
        </header>

        <div className="mb-20">
          <Sidebar />
        </div>

        {/* 섹션 타이틀 바 */}
        <div className="flex items-center justify-between mb-12 pb-4 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-teal-500 rounded-full" />
            <p className="text-lg font-black tracking-tighter uppercase italic">
              Manage Identity
            </p>
          </div>
        </div>

        {/* 메인 설정 섹션 */}
        <div className="bg-slate-50/30 rounded-[3rem] p-8 md:p-12 border border-slate-100/50 shadow-sm">
          <AccountSection
            {...profile} // ✅ 훅의 상태와 핸들러를 Spread로 전달
            onSave={profile.isEditing ? handleSave : profile.startEdit}
            onCancel={profile.cancelEdit}
            onEditImage={profile.handleEditClick} // ✅ 이미지 수정 버튼 연결
          />
        </div>

        {/* ✅ 보이지 않는 파일 입력창 (Ref 연결) */}
        <input
          type="file"
          ref={profile.fileInputRef}
          onChange={profile.handleFileChange}
          className="hidden"
          accept="image/*"
        />

        {/* 하단 푸터 장식 */}
        <div className="mt-32 pt-10 border-t border-slate-50 flex justify-between items-center">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            Privacy Protected Environment
          </p>
          <div className="text-[10px] text-slate-200 font-serif italic">
            ID: {member.email}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
