// features/member/components/UserInitializer.tsx
"use client";

import { useEffect } from "react";
import { useUserStore } from "@/features/member/store/useUserStore";
import { useLikeStore } from "@/features/member/store/useLikeStore";
import { useMyLikes } from "@/features/member/hooks/useMyLikes";

/**
 * ✅ 현업 스타일: Data Initializer
 * 화면 렌더링과 관계없이 유저의 전역 상태(좋아요 등)를
 * 서버와 동기화하는 역할만 수행합니다.
 */
export function UserInitializer() {
  const { email } = useUserStore();
  const { setLikedPosts } = useLikeStore();

  // 우리가 만든 React Query 훅 사용 (캐싱 처리 포함)
  const { data: likedPostsData } = useMyLikes();

  useEffect(() => {
    if (email && likedPostsData) {
      // 서버에서 가져온 좋아요 ID 리스트를 Zustand에 부어줌
      const ids = likedPostsData.map((p: any) => Number(p.postId));
      setLikedPosts(ids);
    }
  }, [email, likedPostsData, setLikedPosts]);

  return null; // 아무것도 렌더링하지 않음
}
