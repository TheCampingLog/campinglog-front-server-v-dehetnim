import { useState, useCallback, useEffect } from "react";
import { useUserStore } from "@/features/member/store/useUserStore";

export function useMyReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({
    currentPage: 1,
    totalPages: 0,
    totalElements: 0,
  });
  const { email } = useUserStore();

  const fetchReviews = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/members/reviews?page=${page}`, {
        cache: "no-store",
      });
      const data = await response.json();
      if (response.ok) {
        setReviews(data.content || []);
        setMeta({
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
          currentPage: data.number || 1,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async (e: React.MouseEvent, postId: number) => {
    e.preventDefault();
    if (!confirm("삭제하시겠습니까?")) return;
    const response = await fetch(`/api/community/posts/${postId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      alert("삭제되었습니다.");
      const isLast = reviews.length === 1 && meta.currentPage > 1;
      fetchReviews(isLast ? meta.currentPage - 1 : meta.currentPage);
    }
  };

  useEffect(() => {
    if (email) fetchReviews(1);
  }, [email, fetchReviews]);

  return { reviews, isLoading, ...meta, fetchReviews, handleDelete };
}
