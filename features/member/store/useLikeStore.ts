import { create } from "zustand";

interface LikeState {
  likedPosts: number[];
  // 서버에서 받은 ID 리스트를 통째로 붓는 방식 (JPA의 List<Long> ids와 유사)
  setLikedPosts: (ids: number[]) => void;
  toggleLike: (postId: number) => void;
  isLiked: (postId: number) => boolean;
  clearLikes: () => void;
}

// ✅ persist를 제거합니다. 세션 관리는 React Query가 담당하게 합니다.
export const useLikeStore = create<LikeState>()((set, get) => ({
  likedPosts: [],

  setLikedPosts: (ids) => set({ likedPosts: ids }),

  toggleLike: (postId) => {
    const id = Number(postId);
    const { likedPosts } = get();
    const isAlreadyLiked = likedPosts.includes(id);

    if (isAlreadyLiked) {
      set({ likedPosts: likedPosts.filter((item) => item !== id) });
    } else {
      set({ likedPosts: [...likedPosts, id] });
    }
  },

  isLiked: (postId) => get().likedPosts.includes(Number(postId)),

  clearLikes: () => set({ likedPosts: [] }),
}));
