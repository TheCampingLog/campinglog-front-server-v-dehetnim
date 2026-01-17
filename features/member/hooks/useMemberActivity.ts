"use client";

import { useState, useEffect, useCallback } from "react";
import { useUserStore } from "@/features/member/store/useUserStore";

export function useMemberActivity() {
  const { nickname } = useUserStore();
  const [counts, setCounts] = useState({
    posts: 0,
    reviews: 0,
    comments: 0,
    likes: 0,
  });

  const fetchActivityCounts = useCallback(async () => {
    // 1. 닉네임이 없으면 호출하지 않음
    if (!nickname) return;

    try {
      // 2. 세 번의 호출 대신, 서버에서 이미 계산된 'activity' 데이터 하나만 호출
      const response = await fetch(
        `/api/members/activity?nickname=${encodeURIComponent(nickname)}`,
        {
          cache: "no-store",
        }
      );

      if (response.ok) {
        const data = await response.json();
        // 3. 서버가 준 { posts, reviews, comments, likes } 정답을 바로 세팅
        setCounts(data);
      }
    } catch (e) {
      console.error("Activity fetch failed:", e);
    }
  }, [nickname]);

  useEffect(() => {
    fetchActivityCounts();
  }, [nickname, fetchActivityCounts]);

  return { counts, nickname };
}
