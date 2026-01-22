"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/features/member/store/useUserStore";

export function useCommunityWrite(initialData?: any) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { nickname, email } = useUserStore();

  const [form, setForm] = useState({
    title: "",
    category: "정보공유",
    rating: 5,
    content: "",
    imageUrl: "" as string,
  });

  // 🚀 핵심: 서버 부하 및 중복 요청을 방지하기 위한 세마포어(Semaphore) 역할
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        category: initialData.category || "정보공유",
        rating: initialData.rating || 5,
        content: initialData.content || "",
        imageUrl: initialData.image || "",
      });
    }
  }, [initialData]);

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * 🖼️ 이미지 업로드 핸들러
   * 바이너리 데이터를 서버에 먼저 저장하고 URL만 반환받는 '분리형 저장 방식'입니다.
   */
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 용량 제한 (5MB) - 클라이언트 측 1차 방어선
    if (file.size > 5 * 1024 * 1024) {
      return alert("이미지 크기는 5MB를 초과할 수 없습니다.");
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsSubmitting(true); // 업로드 중 버튼 차단
      const res = await fetch("/api/community/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.url) {
        updateField("imageUrl", data.url);
      } else {
        alert(data.message || "이미지 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("Image Upload Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 💾 최종 데이터 저장 (POST / PUT)
   * 자바의 @Transactional 서비스 메서드와 유사한 역할을 수행합니다.
   */
  const saveContent = async (postId?: number) => {
    // 1. 유효성 검사 (Validation)
    if (!form.title.trim() || !form.content.trim()) {
      return alert("제목과 내용을 모두 입력해주세요.");
    }

    // 🚀 2. 중복 클릭 방지 (Double-Click Prevention)
    if (isSubmitting) return;

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
          title: form.title,
          category: form.category,
          rating: form.rating,
          content: form.content,
          image: form.imageUrl, // ✅ 고용량 데이터가 아닌 URL 문자열만 전송
          author: nickname,
          authorEmail: email,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // 3. 관련 도메인 캐시 만료 (자바의 @CacheEvict와 동일)
        // 병렬로 처리하여 속도를 높입니다.
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["posts"] }),
          queryClient.invalidateQueries({ queryKey: ["reviews"] }),
          queryClient.invalidateQueries({ queryKey: ["member"] }),
        ]);

        const targetId = postId || result.post?.postId;

        // 4. 페이지 이동 전 미세한 지연 (서버 파일 I/O 정착 시간 확보)
        setTimeout(() => {
          if (targetId) {
            router.push(
              form.category === "캠핑장비 리뷰"
                ? `/community/reviews/${targetId}`
                : `/community/posts/${targetId}`
            );
          } else {
            router.push("/community");
          }
          router.refresh();
        }, 100);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      // 🚀 작업 완료 후 락(Lock) 해제
      setIsSubmitting(false);
    }
  };

  return { form, updateField, handleImageChange, saveContent, isSubmitting };
}
