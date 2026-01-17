"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { MessageSquare, Trash2 } from "lucide-react";

interface Comment {
  commentId: number;
  postId: number;
  content: string;
  author: string;
  authorEmail: string;
  authorImage: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: number;
  nickname: string | null;
  currentUserEmail: string | null;
  profileImage: string | null;
  variant?: "light" | "dark"; // ✅ variant 속성 추가
}

export function CommentSection({
  postId,
  nickname,
  currentUserEmail,
  profileImage,
  variant = "light", // ✅ 기본값 설정
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDark = variant === "dark"; // ✅ 테마 판별 변수

  // 1. 댓글 리스트 페칭
  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/community/comments?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("댓글 로드 오류:", error);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId, fetchComments]);

  // 2. 댓글 등록 핸들러
  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return alert("댓글 내용을 입력해주세요.");
    if (!nickname) return alert("로그인이 필요합니다.");
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          content: commentInput,
          author: nickname,
          authorEmail: currentUserEmail,
          authorImage: profileImage || "/image/default-profile.png",
        }),
      });

      if (response.ok) {
        setCommentInput("");
        fetchComments();
      } else {
        alert("댓글 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 등록 에러:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. 댓글 삭제 핸들러
  const handleCommentDelete = async (commentId: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(
        `/api/community/comments?commentId=${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchComments();
      } else {
        alert("삭제 권한이 없거나 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  };

  return (
    <section
      className={`py-20 mt-20 ${isDark ? "" : "border-t border-slate-100"}`}
    >
      {/* 댓글 헤더 */}
      <h3
        className={`text-2xl font-bold tracking-tight flex items-center gap-3 mb-12 ${
          isDark ? "text-white italic uppercase" : "text-slate-900"
        }`}
      >
        <MessageSquare className="w-6 h-6 text-teal-500" />
        {isDark ? "Discussion" : "Conversation"}{" "}
        <span className="text-slate-300 font-light">{comments.length}</span>
      </h3>

      {/* 댓글 입력창 */}
      <div
        className={`mb-16 rounded-2xl p-6 transition-all ${
          isDark
            ? "bg-slate-900 text-white shadow-2xl border border-white/10"
            : "bg-white border-2 border-slate-50 shadow-sm focus-within:border-teal-500"
        }`}
      >
        <textarea
          placeholder={
            nickname
              ? `${nickname}님, 당신의 생각을 나누어보세요.`
              : "로그인 후 대화에 참여해보세요."
          }
          className={`w-full h-32 bg-transparent border-none outline-none resize-none mb-4 ${
            isDark
              ? "text-white placeholder:text-white/30"
              : "text-slate-700 placeholder:text-slate-300"
          }`}
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          disabled={!nickname}
        />
        <div
          className={`flex justify-end pt-4 ${
            isDark ? "border-t border-white/10" : ""
          }`}
        >
          <button
            onClick={handleCommentSubmit}
            disabled={!nickname || isSubmitting}
            className={`px-8 py-3 text-xs font-bold transition-all ${
              isDark
                ? "border border-white text-white hover:bg-white hover:text-slate-900"
                : "bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-lg"
            } disabled:opacity-20`}
          >
            {isSubmitting ? "Sending..." : isDark ? "Submit" : "Send Message"}
          </button>
        </div>
      </div>

      {/* 댓글 리스트 */}
      <div className="space-y-12">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={comment.commentId} className="flex gap-6 group relative">
              {/* 다크모드 전용 인덱스 표시 (리뷰 페이지 스타일) */}
              {isDark && (
                <div className="text-[10px] font-bold text-slate-200 absolute -left-12 top-1 hidden md:block">
                  {(index + 1).toString().padStart(2, "0")}
                </div>
              )}

              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0">
                <Image
                  src={comment.authorImage || "/image/default-profile.png"}
                  alt="avatar"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-bold ${
                        isDark
                          ? "text-white text-xs tracking-widest"
                          : "text-slate-900"
                      }`}
                    >
                      {comment.author}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {comment.createdAt}
                    </span>
                  </div>

                  {comment.authorEmail === currentUserEmail && (
                    <button
                      onClick={() => handleCommentDelete(comment.commentId)}
                      className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p
                  className={`leading-relaxed font-light ${
                    isDark ? "text-slate-300 text-lg" : "text-slate-600"
                  }`}
                >
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-300 font-light italic">
            첫 번째 댓글을 남겨 이 대화를 시작해보세요.
          </div>
        )}
      </div>
    </section>
  );
}
