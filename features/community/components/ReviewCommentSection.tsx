"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

export function ReviewCommentSection({
  postId,
  nickname,
  currentUserEmail,
  profileImage,
}: any) {
  const [comments, setComments] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState("");

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/community/comments?postId=${postId}`);
    if (res.ok) setComments(await res.json());
  }, [postId]);

  const onSubmit = async () => {
    if (!commentInput.trim() || !nickname) return;
    const res = await fetch("/api/community/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        content: commentInput,
        author: nickname,
        authorEmail: currentUserEmail,
        authorImage: profileImage,
      }),
    });
    if (res.ok) {
      setCommentInput("");
      fetchComments();
    }
  };

  const onDelete = async (id: number) => {
    if (confirm("삭제하시겠습니까?")) {
      await fetch(`/api/community/comments?commentId=${id}`, {
        method: "DELETE",
      });
      fetchComments();
    }
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <section className="max-w-3xl mx-auto">
      {/* 리뷰 페이지 전용: 블랙 테마 입력창 */}
      <div className="bg-slate-900 text-white p-12 rounded-sm mb-20 shadow-2xl">
        <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 italic">
          Discussion
        </h3>
        <textarea
          placeholder="당신의 의견을 공유하세요."
          className="w-full bg-transparent border-b border-white/20 outline-none text-white placeholder:text-white/30 py-4 mb-6 resize-none h-24 focus:border-white transition-all"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <div className="flex justify-end pt-4">
          <button
            onClick={onSubmit}
            className="text-xs font-bold uppercase tracking-widest border border-white px-8 py-3 hover:bg-white hover:text-slate-900 transition-all"
          >
            Submit
          </button>
        </div>
      </div>

      {/* 리뷰 페이지 전용: 번호가 표시되는 댓글 리스트 */}
      <div className="space-y-16">
        {comments.map((comment, index) => (
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
        ))}
      </div>
    </section>
  );
}
