"use client";

import { useState, useEffect, useRef } from "react";

export function useProfileEdit(
  initialNickname: string,
  initialPhone: string,
  initialImage: string,
  initialEmail: string
) {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // ✅ 이미지 입력을 위한 Ref 추가

  // 1. 서버 동기화 원본 데이터
  const [nickname, setNickname] = useState(initialNickname);
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [profileImage, setProfileImage] = useState(initialImage);
  const [email, setEmail] = useState(initialEmail);

  // 2. 사용자가 입력 중인 임시 데이터
  const [tempNickname, setTempNickname] = useState(initialNickname);
  const [tempPhoneNumber, setTempPhoneNumber] = useState(initialPhone);
  const [previewImage, setPreviewImage] = useState(initialImage);

  // 3. 서버 데이터 변경 시 동기화
  useEffect(() => {
    setNickname(initialNickname);
    setTempNickname(initialNickname);
    setPhoneNumber(initialPhone || "");
    setTempPhoneNumber(initialPhone || "");
    setProfileImage(initialImage || "/image/default-profile.png");
    setPreviewImage(initialImage || "/image/default-profile.png");
    setEmail(initialEmail);
  }, [initialNickname, initialPhone, initialImage, initialEmail]);

  // --- 이미지 처리 로직 (useProfileUpdate에서 가져옴) ---

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("이미지 크기는 2MB를 초과할 수 없습니다.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string); // ✅ 임시 이미지 상태만 업데이트
      };
      reader.readAsDataURL(file);
    }
  };

  // --- 상태 제어 로직 ---

  const startEdit = () => setIsEditing(true);

  const saveEdit = () => {
    setNickname(tempNickname);
    setPhoneNumber(tempPhoneNumber);
    setProfileImage(previewImage);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setTempNickname(nickname);
    setTempPhoneNumber(phoneNumber);
    setPreviewImage(profileImage);
    setIsEditing(false);
  };

  return {
    isEditing,
    nickname,
    phoneNumber,
    profileImage,
    email,
    tempNickname,
    tempPhoneNumber,
    previewImage,
    fileInputRef, // ✅ 추가
    handleEditClick, // ✅ 추가
    handleFileChange, // ✅ 추가
    setTempNickname,
    setTempPhoneNumber,
    startEdit,
    saveEdit,
    cancelEdit,
  };
}
