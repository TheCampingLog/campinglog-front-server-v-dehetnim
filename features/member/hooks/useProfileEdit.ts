"use client";

import { useState, useEffect, useRef } from "react";

export function useProfileEdit(
  initialNickname: string,
  initialPhone: string,
  initialImage: string,
  initialEmail: string
) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ 서버 통신 락(Lock)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. 서버 동기화 원본 데이터
  const [nickname, setNickname] = useState(initialNickname);
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [profileImage, setProfileImage] = useState(initialImage);
  const [email, setEmail] = useState(initialEmail);

  // 2. 사용자가 입력 중인 임시 데이터 (DTO 개념)
  const [tempNickname, setTempNickname] = useState(initialNickname);
  const [tempPhoneNumber, setTempPhoneNumber] = useState(initialPhone);
  const [previewImage, setPreviewImage] = useState(initialImage);
  const [uploadFile, setUploadFile] = useState<File | null>(null); // ✅ 실제 파일 객체 저장

  useEffect(() => {
    setNickname(initialNickname);
    setTempNickname(initialNickname);
    setPhoneNumber(initialPhone || "");
    setTempPhoneNumber(initialPhone || "");
    const img = initialImage || "/image/default-profile.png";
    setProfileImage(img);
    setPreviewImage(img);
    setEmail(initialEmail);
  }, [initialNickname, initialPhone, initialImage, initialEmail]);

  // --- 이미지 핸들링 (자바의 MultipartFile 처리 준비) ---

  const handleEditClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("2MB 이하만 가능합니다.");

      setUploadFile(file); // ✅ 서버 전송을 위해 파일 객체 보관

      // ✅ Preview는 단순 UI 표시용으로만 사용 (메모리 효율적)
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // --- 비즈니스 로직 (Update Service 역할) ---

  const startEdit = () => setIsEditing(true);

  const saveEdit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let finalImageUrl = profileImage;

      // 🚀 1. 새로운 파일이 있다면 먼저 서버에 업로드 (Base64 저장 방지)
      if (uploadFile) {
        const formData = new FormData();
        formData.append("file", uploadFile);

        const uploadRes = await fetch("/api/community/upload", {
          // 기존 업로드 API 재사용
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          finalImageUrl = uploadData.url; // 서버가 준 URL로 교체
        }
      }

      // 🚀 2. 회원 정보 수정 API 호출 (자바의 PATCH/PUT 요청)
      const response = await fetch("/api/members/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          nickname: tempNickname,
          phoneNumber: tempPhoneNumber,
          profileImage: finalImageUrl, // ✅ Base64가 아닌 URL 저장
        }),
      });

      if (response.ok) {
        setNickname(tempNickname);
        setPhoneNumber(tempPhoneNumber);
        setProfileImage(finalImageUrl);
        setIsEditing(false);
        setUploadFile(null);
        alert("프로필이 수정되었습니다.");
      }
    } catch (error) {
      console.error("Profile Update Error:", error);
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setTempNickname(nickname);
    setTempPhoneNumber(phoneNumber);
    setPreviewImage(profileImage);
    setUploadFile(null);
    setIsEditing(false);
  };

  return {
    isEditing,
    isSubmitting,
    nickname,
    phoneNumber,
    profileImage,
    email,
    tempNickname,
    tempPhoneNumber,
    previewImage,
    fileInputRef,
    handleEditClick,
    handleFileChange,
    setTempNickname,
    setTempPhoneNumber,
    startEdit,
    saveEdit,
    cancelEdit,
  };
}
