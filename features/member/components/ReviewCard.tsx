import { Star, Trash2, Quote, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ReviewCardProps {
  review: any;
  onDelete: (e: React.MouseEvent, postId: number) => void;
}

export function ReviewCard({ review, onDelete }: ReviewCardProps) {
  return (
    <div className="group relative bg-slate-50/50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-700">
      <Quote className="absolute top-8 right-12 w-12 h-12 text-slate-100 group-hover:text-teal-50 transition-colors duration-700" />

      <div className="flex flex-col md:flex-row gap-12 relative z-10">
        <div className="md:w-64 shrink-0">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">
              Product Identity
            </span>
            <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tighter">
              {review.title}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < (review.rating || 0)
                        ? "fill-current"
                        : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] font-black text-slate-400">
                ({(review.rating || 0).toFixed(1)})
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-8 md:pt-0 md:pl-12">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                {review.createdAt}
              </span>
              <button
                onClick={(e) => onDelete(e, review.postId)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <p className="text-lg text-slate-600 font-serif leading-relaxed line-clamp-4 italic mb-8">
              "{review.content}"
            </p>
          </div>
          <div className="flex justify-end">
            <Link
              href={`/community/posts/${review.postId}`}
              className="group/link flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] hover:text-teal-600 transition-all"
            >
              Full Review{" "}
              <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
