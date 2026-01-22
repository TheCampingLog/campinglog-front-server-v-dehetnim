"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/features/member/store/useUserStore";

export interface Post {
  postId: number;
  title: string;
  category: string;
  createdAt: string;
  viewCount: number;
  commentCount: number;
  image: string | null;
  author: string;
}

export function useMyPosts(page: number = 1) {
  const queryClient = useQueryClient(); // ✅ 스프링의 CacheManager/EntityManager 역할
  const { email } = useUserStore();

  // ✅ 1. 조회 (JPA findByEmail + Paging 역할)
  const { data, isLoading } = useQuery({
    // 키에 page를 포함하여 페이지별로 캐싱됩니다.
    queryKey: ["posts", "my", email, page],
    queryFn: async () => {
      const res = await fetch(`/api/members/posts?page=${page}`);
      if (!res.ok) throw new Error("게시글 로드 실패");
      return res.json();
    },
    enabled: !!email, // 이메일이 있을 때만 쿼리 실행
    staleTime: 1000 * 60, // 1분간 캐시 유지
  });

  // ✅ 2. 삭제 (자바의 @Modifying 쿼리 역할)
  const deleteMutation = useMutation({
    mutationFn: async (postId: number) => {
      const res = await fetch(`/api/community/posts/${postId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("삭제 중 오류가 발생했습니다.");
      return res.json();
    },
    onSuccess: () => {
      alert("삭제되었습니다.");

      /**
       * ✅ [트랜잭션 후처리] 캐시 무효화 (Invalidation)
       * 1. '내 게시글 목록' 캐시를 무효화하여 현재 페이지를 다시 불러옵니다.
       * 2. '활동 요약(activity)' 캐시도 무효화하여 대시보드 숫자를 갱신합니다.
       */
      queryClient.invalidateQueries({ queryKey: ["posts", "my"] });
      queryClient.invalidateQueries({ queryKey: ["member", "activity"] });
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  const handleDelete = (e: React.MouseEvent, postId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("삭제하시겠습니까?")) {
      deleteMutation.mutate(postId);
    }
  };

  return {
    posts: data?.content || [],
    isLoading,
    totalPages: data?.totalPages || 0,
    totalElements: data?.totalElements || 0,
    currentPage: data?.number || 1,
    handleDelete,
  };
}
