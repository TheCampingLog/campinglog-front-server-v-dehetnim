"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Sidebar from "@/features/member/components/common/Sidebar";
import { AccountSection } from "@/features/member/components/AccountSection";
import { useProfileEdit } from "@/features/member/hooks/useProfileEdit";
import { useUserStore } from "@/features/member/store/useUserStore";
import { useMemberData } from "@/features/member/hooks/useMemberData";

export default function AccountPage() {
  const { member, isLoading } = useMemberData();

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

  return <AccountContent member={member} />;
}

function AccountContent({ member }: { member: any }) {
  const queryClient = useQueryClient();
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  const profile = useProfileEdit(
    member.nickname || "",
    member.phoneNumber || "",
    member.profileImage || "/image/default-profile.png",
    member.email || ""
  );

  useEffect(() => {
    if (member) {
      setUserInfo({
        nickname: member.nickname,
        profileImage: member.profileImage,
        email: member.email,
      });
    }
  }, [member, setUserInfo]);

  const handleSave = async () => {
    try {
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
        /**
         * ✅ 자바의 @CacheEvict 전략 적용
         * 닉네임이 변경되면 닉네임을 조건(Where)으로 사용하는 모든 쿼리가 영향을 받습니다.
         * ["member"]로 시작하는 모든 하위 키(account, activity, rank 등)를 한꺼번에 무효화합니다.
         */
        queryClient.invalidateQueries({ queryKey: ["member"] });

        profile.saveEdit();
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

        <div className="flex items-center justify-between mb-12 pb-4 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-teal-500 rounded-full" />
            <p className="text-lg font-black tracking-tighter uppercase italic">
              Manage Identity
            </p>
          </div>
        </div>

        <div className="bg-slate-50/30 rounded-[3rem] p-8 md:p-12 border border-slate-100/50 shadow-sm">
          <AccountSection
            {...profile}
            onSave={profile.isEditing ? handleSave : profile.startEdit}
            onCancel={profile.cancelEdit}
            onEditImage={profile.handleEditClick}
          />
        </div>

        <input
          type="file"
          ref={profile.fileInputRef}
          onChange={profile.handleFileChange}
          className="hidden"
          accept="image/*"
        />

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
