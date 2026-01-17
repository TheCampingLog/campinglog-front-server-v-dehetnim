import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Eye, Star, Calendar } from "lucide-react";

export function VibeCard({
  item,
  viewMode,
}: {
  item: any;
  viewMode: "grid" | "list";
}) {
  const isReview = item.type === "review";
  const href = isReview
    ? `/community/reviews/${item.postId}`
    : `/community/posts/${item.postId}`;

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden transition-all duration-300 bg-white border border-gray-100 hover:shadow-2xl ${
        viewMode === "grid"
          ? "rounded-3xl flex flex-col"
          : "rounded-2xl flex flex-row items-center p-5 gap-8"
      }`}
    >
      {/* 이미지 썸네일 영역 */}
      <div
        className={`relative bg-gray-100 overflow-hidden shrink-0 ${
          viewMode === "grid"
            ? "w-full aspect-[4/3]"
            : "w-32 h-32 md:w-56 md:h-36 rounded-xl"
        }`}
      >
        <Image
          src={item.image || "/image/default-camp.jpg"}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-black/20 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
            {item.category}
          </span>
        </div>
        {item.rating && isReview && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm text-[10px] font-bold text-teal-700 border border-teal-50">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {item.rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* 텍스트 정보 영역 */}
      <div
        className={`flex flex-col flex-1 ${
          viewMode === "grid" ? "p-6" : "py-1"
        }`}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <Calendar className="w-3 h-3" /> {item.createdAt}
          </div>
          <h3
            className={`font-bold text-slate-900 group-hover:text-teal-600 transition-colors leading-tight ${
              viewMode === "grid"
                ? "text-xl line-clamp-1"
                : "text-xl md:text-2xl line-clamp-1"
            }`}
          >
            {item.title}
          </h3>
          {viewMode === "list" && (
            <p className="text-slate-400 text-sm line-clamp-2 font-light leading-relaxed mb-4">
              {item.content ||
                "Discover the details of this amazing camping trip."}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <div className="relative w-7 h-7 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={item.authorImage || "/image/default-profile.png"}
                alt="author"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-slate-900 font-black text-[12px] tracking-tight">
              {item.author || "Camper"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold text-slate-400">
                {item.viewCount}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold text-slate-400">
                {item.commentCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
