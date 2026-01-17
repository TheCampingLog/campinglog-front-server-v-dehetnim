import { useState, useEffect, useCallback } from "react";
import { useUserStore } from "@/features/member/store/useUserStore";

export function useMyComments() {
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { nickname } = useUserStore();

  const fetchMyComments = useCallback(async () => {
    try {
      setIsLoading(true);
      // ✅ 수정된 백엔드 API 호출 (내 댓글 + 제목이 결합된 데이터)
      const response = await fetch("/api/members/comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("내 댓글 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async (e: React.MouseEvent, commentId: number) => {
    e.preventDefault();
    if (!confirm("이 소중한 기록을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(
        `/api/community/comments?commentId=${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("삭제되었습니다.");
        fetchMyComments();
      }
    } catch (error) {
      console.error("삭제 오류:", error);
    }
  };

  useEffect(() => {
    if (nickname) fetchMyComments();
  }, [nickname, fetchMyComments]);

  return { comments, isLoading, handleDelete, fetchMyComments };
}
