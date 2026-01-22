"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/features/member/store/useUserStore";

export function useMyReviews(page: number = 1) {
  const queryClient = useQueryClient(); // ✅ 스프링의 CacheManager 역할
  const { email } = useUserStore();

  // ✅ 1. 리뷰 목록 조회 (JPA findByAuthorEmail + Paging)
  const { data, isLoading } = useQuery({
    // 페이지 번호와 이메일을 키에 포함하여 페이지별 캐싱
    queryKey: ["reviews", "my", email, page],
    queryFn: async () => {
      const response = await fetch(`/api/members/reviews?page=${page}`);
      if (!response.ok) throw new Error("리뷰 로드 실패");
      return response.json();
    },
    enabled: !!email,
    staleTime: 1000 * 60 * 5, // 5분 캐시
  });

  // ✅ 2. 리뷰 삭제 (Mutation)
  const deleteMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await fetch(`/api/community/posts/${postId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("삭제 실패");
      return response.json();
    },
    onSuccess: () => {
      alert("삭제되었습니다.");

      /**
       * 🚀 트랜잭션 후처리 (Invalidation)
       * "내 리뷰 목록"과 "활동 통계" 캐시를 동시에 만료시킵니다.
       * 이 작업 덕분에 마이페이지 메인의 '리뷰 수' 숫자가 새로고침 없이 즉시 바뀝니다.
       */
      queryClient.invalidateQueries({ queryKey: ["reviews", "my"] });
      queryClient.invalidateQueries({ queryKey: ["member", "activity"] });
    },
    onError: (error: any) => {
      alert(error.message || "삭제 중 오류가 발생했습니다.");
    },
  });

  const handleDelete = (e: React.MouseEvent, postId: number) => {
    e.preventDefault();
    if (confirm("삭제하시겠습니까?")) {
      deleteMutation.mutate(postId);
    }
  };

  return {
    reviews: data?.content || [],
    isLoading,
    totalPages: data?.totalPages || 0,
    totalElements: data?.totalElements || 0,
    currentPage: data?.number || 1,
    handleDelete,
  };
}
