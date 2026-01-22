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
      return res.json(); // [{ postId: 1, ... }, { postId: 2, ... }]
    },
    enabled: !!email,
  });

  // ✅ [중요] 서버 데이터가 들어오면 Zustand 스토어와 동기화
  useEffect(() => {
    if (query.data) {
      const ids = query.data.map((p: any) => Number(p.postId));
      setLikedPosts(ids);
    }
  }, [query.data, setLikedPosts]);

  return query;
}
