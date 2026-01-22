"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useLikeStore } from "@/features/member/store/useLikeStore";
import { useUserStore } from "@/features/member/store/useUserStore";

export function usePostDetail(postId: number) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { toggleLike, isLiked } = useLikeStore();
  const { nickname, email: currentUserEmail, profileImage } = useUserStore();

  const fetchPost = useCallback(async () => {
    if (!postId || isNaN(postId)) return;

    try {
      setIsLoading(true);
      fetch(`/api/community/posts/${postId}/view`, { method: "POST" }).catch(
        () => {}
      );

      const res = await fetch(`/api/community/posts/${postId}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const text = await res.text();
        if (!text || text.trim() === "") {
          setPost(null);
          return;
        }
        setPost(JSON.parse(text));
      } else {
        setPost(null);
      }
    } catch (error) {
      setPost(null);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const handleLike = async () => {
    if (!nickname) return alert("로그인이 필요합니다.");
    toggleLike(postId);
    const nextStatus = isLiked(postId);

    try {
      const res = await fetch(`/api/community/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isLiked: nextStatus,
          nickname,
          email: currentUserEmail,
        }),
      });

      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["member"] });
        queryClient.invalidateQueries({ queryKey: ["member", "likes"] });
        const data = await res.json();
        setPost((prev: any) =>
          prev ? { ...prev, likeCount: data.likeCount } : null
        );
      }
    } catch (error) {
      toggleLike(postId);
    }
  };

  /**
   * 3. 삭제 로직 (DELETE)
   * ✅ await를 추가하여 캐시 무효화가 완료된 후 페이지를 이동시킵니다.
   */
  const handleDelete = async () => {
    if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/community/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // 🚀 [해결책] "member"로 시작하는 모든 캐시를 무효화합니다.
        // 이렇게 하면 ["member", "activity", email] 도 포함되어 대시보드가 갱신됩니다.
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["posts"] }),
          queryClient.invalidateQueries({ queryKey: ["member"] }), // 하위 키 전체 포함
          queryClient.invalidateQueries({ queryKey: ["member", "likes"] }),
          queryClient.invalidateQueries({ queryKey: ["comments", "my"] }),
        ]);

        alert("삭제되었습니다.");
        router.push("/community");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return {
    post,
    setPost,
    isLoading,
    handleLike,
    handleDelete,
    nickname,
    currentUserEmail,
    profileImage,
    liked: isLiked(postId),
  };
}
