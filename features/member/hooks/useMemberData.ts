"use client";

import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/features/member/store/useUserStore";
import { useEffect } from "react";

// 1. 타입 정의 (기존과 동일)
interface Member {
  nickname: string;
  email: string;
  profileImage: string;
  memberGrade: string;
  phoneNumber?: string;
  joinDate?: string;
}

interface Rank {
  currentRank: string;
  totalPoints: number;
  nextRank: string;
  remainPoints: number;
  rankImageUrl: string;
}

export function useMemberData() {
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  // ✅ [조회 로직 1] 멤버 정보 (JPA findById 처럼 관리됨)
  const { data: member, isLoading: isMemberLoading } = useQuery<Member>({
    queryKey: ["member", "account"],
    queryFn: async () => {
      const res = await fetch("/api/members/account");
      if (!res.ok) throw new Error("멤버 데이터 로드 실패");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5분 동안은 '신선'하다고 간주하여 캐시 사용
  });

  // ✅ [조회 로직 2] 랭크 정보
  const { data: rank, isLoading: isRankLoading } = useQuery<Rank>({
    queryKey: ["member", "rank"],
    queryFn: async () => {
      const res = await fetch("/api/members/rank");
      if (!res.ok) return null;
      return res.json();
    },
    // 실패 시 기본값 처리를 위해 초기값(placeholder)이나 select 활용 가능
  });

  // ✅ [동기화 로직] 데이터가 로드되면 Zustand 스토어 업데이트
  // 리액트 쿼리가 데이터를 가져오면 이 effect가 실행되어 헤더/사이드바와 동기화됩니다.
  useEffect(() => {
    if (member) {
      setUserInfo({
        nickname: member.nickname,
        profileImage: member.profileImage,
        email: member.email,
      });
    }
  }, [member, setUserInfo]);

  // 로딩 상태 통합
  const isLoading = isMemberLoading || isRankLoading;

  // 랭크 기본값 처리 (기존 로직 유지)
  const finalRank = rank || {
    currentRank: "Silver",
    totalPoints: 0,
    nextRank: "Gold",
    remainPoints: 1000,
    rankImageUrl: "/image/rank-silver.png",
  };

  const activity = {
    boardCount: 0,
    commentCount: 0,
    reviewCount: 0,
    likeCount: 0,
    joinDate: member?.joinDate || "2024-01-01",
  };

  return { member, activity, rank: finalRank, isLoading };
}
