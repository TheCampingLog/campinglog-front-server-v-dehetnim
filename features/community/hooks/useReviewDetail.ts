"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useLikeStore } from "@/features/member/store/useLikeStore";
import { useUserStore } from "@/features/member/store/useUserStore";

export function useReviewDetail(reviewId: number) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [review, setReview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { toggleLike, isLiked } = useLikeStore();
  const { nickname, profileImage, email: currentUserEmail } = useUserStore();

  /**
   * 1. 리뷰 상세 데이터 페칭 (READ)
   * 방어적 파싱 로직 포함
   */
  const fetchDetail = useCallback(async () => {
    if (!reviewId || isNaN(reviewId)) return;

    try {
      setIsLoading(true);

      // 조회수 증가 (Fire and Forget)
      fetch(`/api/community/posts/${reviewId}/view`, { method: "POST" }).catch(
        () => {}
      );

      const res = await fetch(`/api/community/posts/${reviewId}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const text = await res.text();
        if (!text || text.trim() === "") {
          setReview(null);
          return;
        }
        setReview(JSON.parse(text));
      } else {
        console.error(`[Review Fetch Error] Status: ${res.status}`);
        setReview(null);
      }
    } catch (error) {
      console.error("[Review Network Error]:", error);
      setReview(null);
    } finally {
      setIsLoading(false);
    }
  }, [reviewId]);

  /**
   * 2. 좋아요 로직 (UPDATE)
   */
  const handleLike = async () => {
    if (!nickname) return alert("로그인이 필요합니다.");

    toggleLike(reviewId);
    const nextLikedStatus = isLiked(reviewId);

    try {
      const res = await fetch(`/api/community/posts/${reviewId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isLiked: nextLikedStatus,
          nickname,
          email: currentUserEmail,
        }),
      });

      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["member"] });
        queryClient.invalidateQueries({ queryKey: ["member", "likes"] });

        const data = await res.json();
        setReview((prev: any) =>
          prev ? { ...prev, likeCount: data.likeCount } : null
        );
      }
    } catch (error) {
      toggleLike(reviewId);
      console.error("Like Error:", error);
    }
  };

  /**
   * 3. 삭제 로직 (DELETE)
   * ✅ 게시글 삭제 시 관련 댓글 캐시도 함께 무효화하여 마이페이지 싱크를 맞춥니다.
   */
  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/community/posts/${reviewId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // 🚀 [Cascade Invalidation]
        // 자바의 @CacheEvict와 유사하게 관련 모든 도메인의 캐시를 만료시킵니다.
        queryClient.invalidateQueries({ queryKey: ["reviews"] });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        queryClient.invalidateQueries({ queryKey: ["member"] });
        queryClient.invalidateQueries({ queryKey: ["member", "likes"] }),
          // 💡 핵심: 게시글이 사라졌으므로 마이페이지 '내 댓글' 리스트도 갱신 대상에 포함합니다.
          queryClient.invalidateQueries({ queryKey: ["comments", "my"] });

        alert("삭제되었습니다.");
        router.push("/community?tab=캠핑장비%20리뷰");
        router.refresh();
      }
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    review,
    isLoading,
    handleLike,
    handleDelete,
    nickname,
    profileImage,
    currentUserEmail,
    liked: isLiked(reviewId),
  };
}
