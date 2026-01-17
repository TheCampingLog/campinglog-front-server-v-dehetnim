"use client";

import { useParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowLeft, Eye, Trash2, Edit3, Calendar } from "lucide-react";

// ✅ 분리한 커스텀 훅과 컴포넌트 임포트
import { usePostDetail } from "@/features/community/hooks/usePostDetail";
import { CommentSection } from "@/features/community/components/CommentSection";

export default function PostDetailPage() {
  const params = useParams();
  const postId = Number(params.id);

  // ✅ 모든 비즈니스 로직은 usePostDetail 훅이 담당합니다.
  const {
    post,
    isLoading,
    handleLike,
    handleDelete,
    liked,
    nickname,
    currentUserEmail,
    profileImage,
  } = usePostDetail(postId);

  // 로딩 상태 UI
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-serif italic text-slate-400">
        Syncing Story...
      </div>
    );
  }

  // 데이터 없음 UI
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-slate-400 font-serif italic text-xl">
          The story has vanished.
        </p>
        <Link
          href="/community"
          className="text-[10px] font-black border-b border-slate-900 pb-1 tracking-widest uppercase"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  const isAuthor = post.authorEmail === currentUserEmail;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      {/* 1. 상단 히어로 섹션 (이미지 및 제목) */}
      <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-slate-900">
        <Image
          src={post.image || "/image/default-camp.jpg"}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end max-w-5xl mx-auto px-6 pb-16">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-8 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>
          <span className="text-teal-400 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-tight mb-8 tracking-tighter drop-shadow-lg">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-teal-500 bg-white">
                <Image
                  src={post.authorImage || "/image/default-profile.png"}
                  alt="author"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <span className="font-bold text-sm">
                {post.author || "Camper"}
              </span>
            </div>
            <div className="h-4 w-[1px] bg-white/30 hidden md:block" />
            <div className="flex items-center gap-2 text-sm font-light">
              <Calendar className="w-4 h-4 text-teal-400" /> {post.createdAt}
            </div>
            <div className="flex items-center gap-2 text-sm font-light">
              <Eye className="w-4 h-4 text-teal-400" /> {post.viewCount || 0}{" "}
              views
            </div>
          </div>
        </div>
      </section>

      {/* 2. 본문 및 인터랙션 섹션 */}
      <main className="max-w-4xl mx-auto px-6 py-20 relative">
        {/* 수정/삭제 버튼 (작성자 전용) */}
        {isAuthor && (
          <div className="absolute top-0 right-6 flex items-center gap-4 py-6">
            <Link
              href={`/community/edit/${postId}`}
              className="text-slate-400 hover:text-teal-600 transition-colors"
            >
              <Edit3 className="w-5 h-5" />
            </Link>
            <button
              onClick={handleDelete}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}

        <article className="prose prose-slate max-w-none">
          <div className="text-slate-700 leading-[2.2] text-xl font-light whitespace-pre-line mb-20">
            {post.content || "내용이 없습니다."}
          </div>
        </article>

        {/* 좋아요 버튼 영역 */}
        <div className="flex flex-col items-center justify-center gap-8 py-16 border-y border-slate-100">
          <button
            onClick={handleLike}
            className={`group relative flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 ${
              liked
                ? "bg-teal-500 text-white shadow-xl shadow-teal-200"
                : "bg-slate-50 text-slate-400 hover:bg-slate-100"
            }`}
          >
            <Heart
              className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                liked ? "fill-white text-white" : ""
              }`}
            />
            <span className="font-bold tracking-widest uppercase text-xs">
              {liked ? "You Liked This" : "Inspiration?"} {post?.likeCount || 0}
            </span>
          </button>
        </div>

        {/* 3. 댓글 섹션 (분리된 컴포넌트) */}
        <CommentSection
          postId={postId}
          nickname={nickname}
          currentUserEmail={currentUserEmail}
          profileImage={profileImage}
        />
      </main>

      <Footer />
    </div>
  );
}
