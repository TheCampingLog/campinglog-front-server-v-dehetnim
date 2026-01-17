"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/features/member/store/useUserStore";

// 1. 타입 정의
interface Member {
  nickname: string;
  email: string;
  profileImage: string;
  memberGrade: string;
  phoneNumber?: string;
  joinDate?: string;
}

interface Activity {
  boardCount: number;
  commentCount: number;
  reviewCount: number;
  likeCount: number;
  joinDate: string;
}

interface Rank {
  currentRank: string;
  totalPoints: number;
  nextRank: string;
  remainPoints: number;
  rankImageUrl: string;
}

export function useMemberData() {
  const [member, setMember] = useState<Member | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [rank, setRank] = useState<Rank | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 전역 스토어 액션 가져오기 (헤더/사이드바 동기화용)
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        /**
         * ✅ 2. 실제 서버 API 호출
         * cache: "no-store"를 통해 Next.js의 데이터 캐싱을 방지합니다.
         */
        const [memberRes, rankRes] = await Promise.all([
          fetch("/api/members/account", {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
          }),
          fetch("/api/members/rank", { cache: "no-store" }).catch(() => null),
        ]);

        if (!memberRes.ok) throw new Error("멤버 데이터 로드 실패");

        const memberData = await memberRes.json();

        // 3. Rank 데이터 처리 (실패 시 기본값)
        let rankData = {
          currentRank: "Silver",
          totalPoints: 0,
          nextRank: "Gold",
          remainPoints: 1000,
          rankImageUrl: "/image/rank-silver.png",
        };

        if (rankRes && rankRes.ok) {
          rankData = await rankRes.json();
        }

        // ✅ 4. 상태 업데이트 (로컬 상태)
        setMember(memberData);
        setRank(rankData);
        setActivity({
          boardCount: 0,
          commentCount: 0,
          reviewCount: 0,
          likeCount: 0,
          joinDate: memberData.joinDate || "2024-01-01",
        });

        // ✅ 5. 전역 스토어(Zustand) 즉시 동기화
        // 이 코드가 있어야 메인 페이지 진입 시 헤더의 닉네임과 사진이 바뀝니다.
        setUserInfo({
          nickname: memberData.nickname,
          profileImage: memberData.profileImage,
          email: memberData.email,
        });
      } catch (error) {
        console.error("데이터 로딩 중 에러 발생:", error);
        setMember(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [setUserInfo]); // setUserInfo를 의존성 배열에 추가

  return { member, activity, rank, isLoading };
}
