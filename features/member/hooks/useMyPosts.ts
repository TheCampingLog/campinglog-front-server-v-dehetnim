import { useState, useCallback, useEffect } from "react";
import { useUserStore } from "@/features/member/store/useUserStore";

// ✅ 1. 데이터 구조를 TypeScript에게 알려줍니다.
export interface Post {
  postId: number;
  title: string;
  category: string;
  createdAt: string;
  viewCount: number;
  commentCount: number;
  image: string | null;
  author: string;
}

export function useMyPosts() {
  // ✅ 2. 빈 배열이 아니라 Post 객체들이 들어올 배열임을 명시합니다 <Post[]>
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({
    currentPage: 1,
    totalPages: 0,
    totalElements: 0,
  });
  const { email } = useUserStore();

  const fetchPosts = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/members/posts?page=${page}`, {
        cache: "no-store", // 최신 데이터 보장
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(data.content || []);
        setMeta({
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
          currentPage: data.number || 1,
        });
      }
    } catch (error) {
      console.error("게시글 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async (e: React.MouseEvent, postId: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/community/posts/${postId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("삭제되었습니다.");

        // ✅ 삭제 후 페이지 이동 로직 최적화
        // 현재 페이지에 글이 하나뿐이고, 그게 1페이지가 아니라면 이전 페이지로 이동
        setPosts((prevPosts) => {
          const isLastItem = prevPosts.length === 1 && meta.currentPage > 1;
          const targetPage = isLastItem
            ? meta.currentPage - 1
            : meta.currentPage;
          fetchPosts(targetPage);
          return prevPosts; // 실제 배열 교체는 fetchPosts가 다시 수행함
        });
      } else {
        const errorData = await res.json();
        alert(errorData.message || "삭제 권한이 없거나 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("삭제 요청 중 오류:", error);
    }
  };

  useEffect(() => {
    if (email) fetchPosts(1);
  }, [email, fetchPosts]);

  return { posts, isLoading, ...meta, fetchPosts, handleDelete };
}
