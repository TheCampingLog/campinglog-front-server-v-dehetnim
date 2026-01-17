import { create } from "zustand";

// 1. 게시글 타입 정의
export interface Post {
  postId: number;
  title: string;
  category: string;
  createdAt: string;
  viewCount: number;
  commentCount: number;
  image: string | null;
  content: string;
  author: string;
  authorEmail?: string;
  rating?: number;
}

interface PostState {
  posts: Post[];
  setPosts: (newPosts: Post[]) => void;
  getAllPosts: () => Post[];
  addPost: (newPostData: Post) => void;
  deletePost: (postId: number) => void;
  updatePost: (postId: number, updatedData: Partial<Post>) => void;
}

// ✅ persist 미들웨어를 제거했습니다.
// 이제 게시글 데이터는 메모리(RAM)에서만 관리되며, 새로고침 시 서버에서 다시 fetch해 옵니다.
export const usePostStore = create<PostState>()((set, get) => ({
  posts: [],

  // 서버 데이터를 스토어에 동기화
  setPosts: (newPosts) =>
    set({ posts: Array.isArray(newPosts) ? newPosts : [] }),

  // 게시글 정렬 및 반환
  getAllPosts: () => {
    return [...get().posts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // 새로운 포스트 추가
  addPost: (newPost) =>
    set((state) => ({
      posts: [newPost, ...state.posts],
    })),

  // 특정 포스트 삭제
  deletePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.postId !== postId),
    })),

  // 특정 포스트 수정
  updatePost: (postId, updatedData) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.postId === postId ? { ...post, ...updatedData } : post
      ),
    })),
}));
