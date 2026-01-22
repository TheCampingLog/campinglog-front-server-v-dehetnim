"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export function ReviewCommentSection({
  postId,
  nickname,
  currentUserEmail,
  profileImage,
}: any) {
  const queryClient = useQueryClient(); // ✅ 스프링의 CacheManager와 동일
  const [commentInput, setCommentInput] = useState("");

  // ✅ 1. 댓글 리스트 조회 (useQuery)
  // 5분 동안 캐시를 유지하며, 무효화되기 전까지 불필요한 API 호출을 막습니다.
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await fetch(`/api/community/comments?postId=${postId}`);
      if (!res.ok) throw new Error("댓글 로드 실패");
      return res.json();
    },
    enabled: !!postId,
  });

  // ✅ 2. 댓글 등록 (useMutation)
  const submitMutation = useMutation({
    mutationFn: async (newComment: any) => {
      const res = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });
      if (!res.ok) throw new Error("등록 실패");
      return res.json();
    },
    onSuccess: () => {
      /**
       * 🚀 핵심: 캐시 무효화 (Invalidation)
       * 자바의 @CacheEvict 전략
       */
      queryClient.invalidateQueries({ queryKey: ["comments", postId] }); // 댓글 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["member"] }); // 마이페이지 댓글 수 갱신
      queryClient.invalidateQueries({ queryKey: ["reviews"] }); // 리뷰 목록의 댓글 카운트 갱신

      setCommentInput(""); // 입력창 초기화
    },
  });

  // ✅ 3. 댓글 삭제 (useMutation)
  const deleteMutation = useMutation({
    mutationFn: async (commentId: number) => {
      await fetch(`/api/community/comments?commentId=${commentId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["member"] });
    },
  });

  const onSubmit = () => {
    if (!commentInput.trim() || !nickname || submitMutation.isPending) return;

    submitMutation.mutate({
      postId,
      content: commentInput,
      author: nickname,
      authorEmail: currentUserEmail,
      authorImage: profileImage || "/image/default-profile.png",
    });
  };

  const onDelete = (id: number) => {
    if (confirm("삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <section className="max-w-3xl mx-auto">
      {/* 리뷰 페이지 전용: 블랙 테마 입력창 */}
      <div className="bg-slate-900 text-white p-12 rounded-sm mb-20 shadow-2xl">
        <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 italic">
          Discussion
        </h3>
        <textarea
          placeholder={
            nickname
              ? "당신의 의견을 공유하세요."
              : "로그인 후 의견을 나눌 수 있습니다."
          }
          className="w-full bg-transparent border-b border-white/20 outline-none text-white placeholder:text-white/30 py-4 mb-6 resize-none h-24 focus:border-white transition-all"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          disabled={!nickname || submitMutation.isPending}
        />
        <div className="flex justify-end pt-4">
          <button
            onClick={onSubmit}
            disabled={!nickname || submitMutation.isPending}
            className="text-xs font-bold uppercase tracking-widest border border-white px-8 py-3 hover:bg-white hover:text-slate-900 transition-all disabled:opacity-30"
          >
            {submitMutation.isPending ? "Sending..." : "Submit"}
          </button>
        </div>
      </div>

      {/* 리뷰 페이지 전용: 번호가 표시되는 댓글 리스트 */}
      <div className="space-y-16">
        {isLoading ? (
          <div className="text-center py-20 text-slate-300 animate-pulse italic">
            Retrieving discussion...
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment: any, index: number) => (
            <div key={comment.commentId} className="flex gap-8 group relative">
              <div className="text-[10px] font-bold text-slate-200 absolute -left-12 top-1">
                {(index + 1).toString().padStart(2, "0")}
              </div>
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0">
                <Image
                  src={comment.authorImage || "/image/default-profile.png"}
                  alt="avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black tracking-widest text-slate-900">
                    {comment.author}
                  </span>
                  {comment.authorEmail === currentUserEmail && (
                    <button
                      onClick={() => onDelete(comment.commentId)}
                      className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-slate-600 leading-relaxed font-light text-lg">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-slate-300 font-light italic border-t border-slate-50">
            No thoughts shared yet. Be the first to comment.
          </div>
        )}
      </div>
    </section>
  );
}
