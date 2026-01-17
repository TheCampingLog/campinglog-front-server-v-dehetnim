import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLikeStore } from "@/features/member/store/useLikeStore";
import { useUserStore } from "@/features/member/store/useUserStore";

export function useReviewDetail(reviewId: number) {
  const router = useRouter();
  const [review, setReview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toggleLike, isLiked } = useLikeStore();
  const { nickname, profileImage, email: currentUserEmail } = useUserStore();

  const fetchDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      fetch(`/api/community/posts/${reviewId}/view`, { method: "POST" }).catch(
        () => {}
      );
      const res = await fetch(`/api/community/posts/${reviewId}`, {
        cache: "no-store",
      });
      if (res.ok) setReview(await res.json());
    } finally {
      setIsLoading(false);
    }
  }, [reviewId]);

  const handleLike = async () => {
    if (!nickname) return alert("로그인이 필요합니다.");
    toggleLike(reviewId);
    const nextLikedStatus = isLiked(reviewId);
    try {
      const res = await fetch(`/api/community/posts/${reviewId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLiked: nextLikedStatus, nickname }),
      });
      if (res.ok) {
        const data = await res.json();
        setReview((prev: any) => ({ ...prev, likeCount: data.likeCount }));
      }
    } catch {
      toggleLike(reviewId);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/community/posts/${reviewId}`, { method: "DELETE" });
    router.push("/community");
  };

  useEffect(() => {
    if (!isNaN(reviewId)) fetchDetail();
  }, [reviewId, fetchDetail]);

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
