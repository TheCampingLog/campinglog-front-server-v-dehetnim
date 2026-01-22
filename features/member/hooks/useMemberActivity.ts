"use client";

import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/features/member/store/useUserStore";

export function useMemberActivity() {
  const { email, isLoggedIn } = useUserStore();

  const { data: counts, isLoading } = useQuery({
    /**
     * ✅ 캐시 키 전략
     * ["member", "activity", email] 구조는 invalidateQueries({ queryKey: ["member"] }) 호출 시
     * 하위 모든 이메일 기반 activity 캐시를 한꺼번에 무효화(Evict)할 수 있어 매우 효율적입니다.
     */
    queryKey: ["member", "activity", email],

    queryFn: async () => {
      if (!email) return { posts: 0, reviews: 0, comments: 0, likes: 0 };

      // API 호출 (Spring의 @GetMapping과 통신하는 상황과 유사)
      const response = await fetch(
        `/api/members/activity?email=${encodeURIComponent(email)}`,
        { cache: "no-store" } // 브라우저 레벨의 캐시도 방지
      );

      if (!response.ok) throw new Error("Activity fetch failed");
      return response.json();
    },

    // 로그인 상태이고 이메일이 있을 때만 실행 (자바의 유효성 검사/Guard Clause)
    enabled: !!email && isLoggedIn,

    /**
     * 🚀 핵심 수정 사항: staleTime 조절
     * 대시보드 통계는 글 쓰기/삭제 후 즉시 반영되어야 하므로 staleTime을 0으로 설정합니다.
     * 이렇게 하면 invalidateQueries가 호출되는 즉시 서버에서 다시 데이터를 fetch합니다.
     */
    staleTime: 0,

    // 유저가 페이지를 다시 보러 왔을 때 최신 카운트를 보여주기 위해 refetch 설정
    refetchOnWindowFocus: true,
  });

  return {
    // 기본값 처리 (NullPointerException 방지 로직과 유사)
    counts: counts || { posts: 0, reviews: 0, comments: 0, likes: 0 },
    isLoading,
  };
}
