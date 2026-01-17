import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LikeState {
  likedPosts: number[]; // 좋아요를 누른 게시글 ID 배열
  toggleLike: (postId: number) => void;
  isLiked: (postId: number) => boolean;
  clearLikes: () => void;
  // ✅ 추가: 서버에서 가져온 게시글 객체 배열에서 ID만 추출해 스토어에 동기화
  syncWithServer: (posts: any[]) => void;
}

export const useLikeStore = create<LikeState>()(
  persist(
    (set, get) => ({
      likedPosts: [],

      // ✅ 서버 데이터 동기화 함수
      // 서버 응답(likedPosts 배열)을 받아서 ID만 추출해 상태를 업데이트합니다.
      syncWithServer: (posts) => {
        if (!Array.isArray(posts)) return;
        const ids = posts.map((p) => Number(p.postId));
        set({ likedPosts: ids });
      },

      toggleLike: (postId) => {
        // 숫자 타입 보장 (params.id가 문자열로 올 때를 대비)
        const id = Number(postId);
        const { likedPosts } = get();
        const isAlreadyLiked = likedPosts.includes(id);

        if (isAlreadyLiked) {
          set({ likedPosts: likedPosts.filter((item) => item !== id) });
        } else {
          set({ likedPosts: [...likedPosts, id] });
        }
      },

      // 상세 페이지 등에서 현재 포스트의 좋아요 여부를 확인할 때 사용
      isLiked: (postId) => get().likedPosts.includes(Number(postId)),

      // 로그아웃 시 로컬 스토리지를 비우기 위한 함수
      clearLikes: () => set({ likedPosts: [] }),
    }),
    {
      name: "like-storage", // localStorage의 Key 이름
    }
  )
);
