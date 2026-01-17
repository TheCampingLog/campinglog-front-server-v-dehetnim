"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Sidebar from "@/features/member/components/common/Sidebar";
import { MessageSquare } from "lucide-react";
import { useMyComments } from "@/features/member/hooks/useMyComments";
import { CommentCard } from "@/features/member/components/CommentCard";

export default function MemberCommentsPage() {
  const { comments, isLoading, handleDelete } = useMyComments();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[1px] bg-slate-900" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Communication Logs
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter italic font-serif">
            My Feedbacks
          </h1>
        </header>

        <div className="mb-20">
          <Sidebar />
        </div>

        <div className="flex items-center justify-between mb-12 pb-6 border-b-2 border-slate-900">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-serif italic">
              {comments.length}
            </span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              Words Shared
            </span>
          </div>
          <MessageSquare className="w-5 h-5 text-slate-200" />
        </div>

        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="py-40 text-center font-serif italic text-slate-300 animate-pulse text-xl">
              Retrieving conversations...
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.commentId}
                  comment={comment}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-4">
                No conversations recorded.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
