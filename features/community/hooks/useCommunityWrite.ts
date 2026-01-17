// features/community/hooks/useCommunityWrite.ts

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/features/member/store/useUserStore";

export function useCommunityWrite(initialData?: any) {
  const router = useRouter();
  const { nickname, email } = useUserStore();

  const [form, setForm] = useState({
    title: "",
    category: "정보공유",
    rating: 5,
    content: "",
    imagePreview: null as string | null, // 이제 Base64가 아닌 서버 URL이 담깁니다.
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        category: initialData.category || "정보공유",
        rating: initialData.rating || 5,
        content: initialData.content || "",
        imagePreview: initialData.image || null,
      });
    }
  }, [initialData]);

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ 변경된 이미지 핸들러: 서버에 즉시 업로드
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 용량 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return alert("이미지 크기는 5MB를 초과할 수 없습니다.");
    }

    // 서버로 전송할 FormData 생성
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/community/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        // ✅ 서버가 넘겨준 URL(/uploads/파일명)을 폼 상태에 저장
        updateField("imagePreview", data.url);
      } else {
        alert(data.message || "업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("이미지 서버 통신 중 오류가 발생했습니다.");
    }
  };

  const saveContent = async (postId?: number) => {
    if (!form.title.trim() || !form.content.trim())
      return alert("입력칸을 채워주세요.");

    setIsSubmitting(true);
    const method = postId ? "PUT" : "POST";
    const url = postId
      ? `/api/community/posts/${postId}`
      : "/api/community/posts";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          image: form.imagePreview, // 서버 URL 경로 전송
          author: nickname,
          authorEmail: email,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const targetId = postId || result.post?.postId;

        if (targetId) {
          router.push(
            form.category === "캠핑장비 리뷰"
              ? `/community/reviews/${targetId}`
              : `/community/posts/${targetId}`
          );
          router.refresh();
        } else {
          router.push("/community");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, updateField, handleImageChange, saveContent, isSubmitting };
}
