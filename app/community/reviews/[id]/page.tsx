"use client";

import { useParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowLeft, Heart, Award, ShieldCheck } from "lucide-react";
import { useReviewDetail } from "@/features/community/hooks/useReviewDetail";
import { ReviewCommentSection } from "@/features/community/components/ReviewCommentSection";

export default function ReviewDetailPage() {
  const params = useParams();
  const reviewId = Number(params.id);
  const {
    review,
    isLoading,
    handleLike,
    handleDelete,
    nickname,
    profileImage,
    currentUserEmail,
    liked,
  } = useReviewDetail(reviewId);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center font-serif italic text-slate-400">
        Syncing Review...
      </div>
    );
  if (!review)
    return (
      <div className="min-h-screen flex items-center justify-center font-serif italic text-slate-400">
        Review not found.
      </div>
    );

  const isAuthor = review.authorEmail === currentUserEmail;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900">
      <Header />
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        {/* 상단 네비게이션 */}
        <div className="flex justify-between items-center mb-16">
          <Link
            href="/community?tab=캠핑장비%20리뷰"
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-xs font-bold uppercase tracking-[0.2em]"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />{" "}
            Back to Collection
          </Link>
          {isAuthor && (
            <div className="flex gap-6">
              <Link
                href={`/community/edit/${reviewId}`}
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="text-[10px] font-black uppercase tracking-widest text-red-300 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24 items-start">
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-slate-100 shadow-2xl">
              <Image
                src={review.image || "/image/default-camp.jpg"}
                alt="Review"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-4 py-2 flex items-center gap-2 rounded-full border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span className="text-[10px] font-bold uppercase tracking-tight text-slate-900">
                  Verified Reviewer
                </span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < (review.rating || 0)
                        ? "fill-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-black text-slate-900 ml-2">
                {(review.rating || 0).toFixed(1)}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-10 break-keep">
              {review.title}
            </h1>
            <div className="flex items-center gap-4 mb-12 pb-12 border-b border-slate-100">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                <Image
                  src={review.authorImage || "/image/default-profile.png"}
                  alt="Author"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black tracking-widest text-slate-900">
                  {review.author || "Anonymous"}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 font-medium">
                  {review.createdAt}
                </span>
              </div>
            </div>
            <button
              onClick={handleLike}
              className={`w-full py-5 rounded-sm border-2 transition-all flex items-center justify-center gap-3 ${
                liked
                  ? "bg-slate-900 border-slate-900 text-white shadow-xl"
                  : "border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${liked ? "fill-white text-white" : ""}`}
              />
              <span className="text-xs font-black uppercase tracking-[0.2em]">
                {liked ? "Added to Wishlist" : "Add to Wishlist"}{" "}
                {review.likeCount || 0}
              </span>
            </button>
          </div>
        </div>

        {/* 본문 */}
        <section className="max-w-3xl mx-auto mb-32 pt-20 border-t border-slate-900">
          <div className="flex items-center gap-2 mb-12">
            <Award className="w-6 h-6 text-slate-900" />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 italic">
              User Experience
            </h2>
          </div>
          <div className="text-slate-800 leading-[2.3] text-xl font-light whitespace-pre-line font-serif">
            {review.content}
          </div>
        </section>

        {/* 리뷰 전용 댓글 섹션 */}
        <ReviewCommentSection
          postId={reviewId}
          nickname={nickname}
          currentUserEmail={currentUserEmail}
          profileImage={profileImage}
        />
      </main>
      <Footer />
    </div>
  );
}
