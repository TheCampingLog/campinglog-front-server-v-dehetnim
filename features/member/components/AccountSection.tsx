"use client";

import { ChevronRight, Camera, Check, X } from "lucide-react";
import Image from "next/image";

interface AccountSectionProps {
  isEditing: boolean;
  nickname: string;
  tempNickname: string;
  email: string;
  phoneNumber: string;
  tempPhoneNumber: string;
  previewImage: string;
  // setPreviewImage: (val: string) => void; // ❌ 과감히 삭제!
  setTempNickname: (val: string) => void;
  setTempPhoneNumber: (val: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEditImage: () => void; // ✅ 이것만 있으면 충분합니다.
}

export function AccountSection({
  isEditing,
  nickname,
  tempNickname,
  email,
  phoneNumber,
  tempPhoneNumber,
  previewImage,
  setTempNickname,
  setTempPhoneNumber,
  onSave,
  onCancel,
  onEditImage, // ✅ 추가
}: AccountSectionProps) {
  // 💡 기존의 내부 fileInputRef와 handleImageChange는
  // 이제 통합 훅(useProfileEdit)이 담당하므로 삭제했습니다.

  return (
    <section className="py-12 border-y border-slate-900 mt-8">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full">
        {/* 1. 프로필 이미지 영역 */}
        <div className="relative shrink-0">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 ring-1 ring-slate-200 ring-offset-2 shadow-inner">
            <Image
              src={previewImage || "/image/default-profile.png"}
              alt="Profile"
              fill
              className={`object-cover transition-all duration-500 ${
                isEditing ? "opacity-40 scale-110 blur-[2px]" : "opacity-100"
              }`}
              unoptimized={
                previewImage.startsWith("data:") ||
                previewImage.startsWith("http")
              }
            />

            {isEditing && (
              <button
                type="button"
                // ✅ 부모로부터 받은 통합 훅의 클릭 핸들러 연결
                onClick={onEditImage}
                className="absolute inset-0 flex items-center justify-center z-10 group"
              >
                <div className="bg-white/90 p-2.5 rounded-full shadow-lg backdrop-blur-md group-hover:bg-white group-hover:scale-110 transition-all">
                  <Camera
                    className="w-5 h-5 text-slate-900"
                    strokeWidth={2.5}
                  />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* 2. 정보 입력/출력 영역 (기존과 동일) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 w-full md:divide-x md:divide-slate-100">
          {/* 닉네임 섹션 */}
          <div className="md:px-10 flex flex-col justify-center">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">
              Nickname
            </span>
            <div className="min-h-[40px] flex items-center">
              {isEditing ? (
                <input
                  type="text"
                  value={tempNickname}
                  onChange={(e) => setTempNickname(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-slate-900 outline-none text-[16px] font-bold text-slate-900 py-1 focus:border-teal-500 transition-colors"
                />
              ) : (
                <p className="text-[18px] font-black text-slate-900 tracking-tight font-serif italic">
                  {nickname || "이름 없음"}
                </p>
              )}
            </div>
          </div>

          {/* 연락처 섹션 */}
          <div className="md:px-10 flex flex-col justify-center">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">
              Contact
            </span>
            <div className="min-h-[40px] flex items-center">
              {isEditing ? (
                <input
                  type="text"
                  value={tempPhoneNumber}
                  onChange={(e) => setTempPhoneNumber(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-slate-900 outline-none text-[16px] font-bold text-slate-900 py-1 focus:border-teal-500 transition-colors"
                />
              ) : (
                <p className="text-[16px] font-medium text-slate-700 tracking-tight">
                  {phoneNumber || "연락처 미등록"}
                </p>
              )}
            </div>
          </div>

          {/* 이메일 섹션 (수정 불가) */}
          <div className="md:px-10 flex flex-col justify-center">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">
              Account Email
            </span>
            <div className="min-h-[40px] flex items-center">
              <p className="text-[15px] font-medium text-slate-400 select-none tracking-tight">
                {email}
              </p>
            </div>
          </div>
        </div>

        {/* 3. 액션 제어 영역 (기존과 동일) */}
        <div className="shrink-0 md:pl-8 flex items-center justify-center">
          {isEditing ? (
            <div className="flex gap-4 items-center">
              <button
                type="button"
                onClick={onCancel}
                className="p-3 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={onSave}
                className="p-3 bg-slate-900 text-white rounded-full hover:bg-teal-600 hover:scale-110 transition-all shadow-xl"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onSave}
              className="group flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-all"
            >
              Edit Info
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
