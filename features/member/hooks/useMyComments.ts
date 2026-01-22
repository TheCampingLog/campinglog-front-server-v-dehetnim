"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/features/member/store/useUserStore";

export function useMyComments() {
  const queryClient = useQueryClient(); // ✅ 스프링의 CacheManager 역할
  const { nickname } = useUserStore();

  // ✅ 1. 내 댓글 목록 조회 (조회 쿼리)
  const {
    data: comments = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["comments", "my", nickname],
    queryFn: async () => {
      const response = await fetch("/api/members/comments");
      if (!response.ok) throw new Error("댓글 로드 실패");
      return response.json();
    },
    enabled: !!nickname, // 닉네임이 있을 때만 실행 (Security Context 확인 개념)
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });

  // ✅ 2. 댓글 삭제 (변경 뮤테이션)
  const deleteMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await fetch(
        `/api/community/comments?commentId=${commentId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("삭제 실패");
      return response.json();
    },
    onSuccess: () => {
      /**
       * 🚀 핵심: 캐시 무효화 (Invalidation)
       * 1. ["comments", "my"]: 내 댓글 목록 즉시 갱신
       * 2. ["member"]: 마이페이지 대시보드의 '댓글 수' 숫자 즉시 갱신
       */
      queryClient.invalidateQueries({ queryKey: ["comments", "my"] });
      queryClient.invalidateQueries({ queryKey: ["member"] });

      alert("삭제되었습니다.");
    },
    onError: (error: any) => {
      console.error("삭제 오류:", error);
      alert("삭제 중 오류가 발생했습니다.");
    },
  });

  const handleDelete = (e: React.MouseEvent, commentId: number) => {
    e.preventDefault(); // 이벤트 버블링 방지 (Link 이동 방지)
    if (confirm("이 소중한 기록을 삭제하시겠습니까?")) {
      deleteMutation.mutate(commentId);
    }
  };

  return {
    comments,
    isLoading,
    handleDelete,
    fetchMyComments: refetch, // 기존 호환성을 위해 refetch 연결
  };
}
