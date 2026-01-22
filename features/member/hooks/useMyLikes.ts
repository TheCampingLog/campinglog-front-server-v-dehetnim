// features/member/hooks/useMyLikes.ts
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/features/member/store/useUserStore";
import { useLikeStore } from "@/features/member/store/useLikeStore";
import { useEffect } from "react";

export function useMyLikes() {
  const { email } = useUserStore();
  const setLikedPosts = useLikeStore((state) => state.setLikedPosts);

  const query = useQuery({
    queryKey: ["member", "likes", email],
    queryFn: async () => {
      const res = await fetch(`/api/members/likes?email=${email}`);
      if (!res.ok) throw new Error("Failed to fetch likes");
      return res.json();
    },
    enabled: !!email,
  });

  // ✅ 수정된 useEffect: 안전하게 체크 후 map 실행
  useEffect(() => {
    // 1. query.data가 존재하고 2. 실제 배열일 때만 실행 (instanceof Array 체크와 유사)
    if (query.data && Array.isArray(query.data)) {
      const ids = query.data.map((p: any) => Number(p.postId));
      setLikedPosts(ids);
    }
  }, [query.data, setLikedPosts]);

  return query;
}
