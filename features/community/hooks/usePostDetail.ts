// features/community/hooks/usePostDetail.ts

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation"; // ✅ router 추가
import { useLikeStore } from "@/features/member/store/useLikeStore";
import { useUserStore } from "@/features/member/store/useUserStore";

export function usePostDetail(postId: number) {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { toggleLike, isLiked } = useLikeStore();
  const { nickname, email: currentUserEmail, profileImage } = useUserStore();

  // 1. 게시글 데이터 페칭 (기존과 동일)
  const fetchPost = useCallback(async () => {
    try {
      setIsLoading(true);
      fetch(`/api/community/posts/${postId}/view`, { method: "POST" }).catch(
        () => {}
      );
      const res = await fetch(`/api/community/posts/${postId}`, {
        cache: "no-store",
      });
      if (res.ok) setPost(await res.json());
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // 2. 좋아요 로직 (기존과 동일)
  const handleLike = async () => {
    if (!nickname) return alert("로그인이 필요합니다.");
    toggleLike(postId);
    const nextStatus = isLiked(postId);
    try {
      const res = await fetch(`/api/community/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLiked: nextStatus, nickname }),
      });
      if (res.ok) {
        const data = await res.json();
        setPost((prev: any) => ({ ...prev, likeCount: data.likeCount }));
      }
    } catch {
      toggleLike(postId);
    }
  };

  // ✅ 3. 삭제 로직 추가 (추락했던 handleDelete를 다시 살려냅니다)
  const handleDelete = async () => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
    try {
      const response = await fetch(`/api/community/posts/${postId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("성공적으로 삭제되었습니다.");
        router.push("/community");
      }
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  useEffect(() => {
    if (!isNaN(postId)) fetchPost();
  }, [postId, fetchPost]);

  // ✅ 마지막 return에 handleDelete를 추가합니다!
  return {
    post,
    setPost,
    isLoading,
    handleLike,
    handleDelete, // 👈 여기가 핵심!
    nickname,
    currentUserEmail,
    profileImage,
    liked: isLiked(postId),
  };
}
