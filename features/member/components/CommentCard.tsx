import Link from "next/link";
import { Trash2, ArrowRight } from "lucide-react";

interface CommentCardProps {
  comment: any;
  onDelete: (e: React.MouseEvent, id: number) => void;
}

export function CommentCard({ comment, onDelete }: CommentCardProps) {
  return (
    <div className="group relative bg-white border border-slate-100 rounded-[2rem] p-8 md:p-10 hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-500">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-teal-500 rounded-full" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {/* ✅ 백엔드에서 결합해준 postTitle 사용 */}
              On Story: {comment.postTitle}
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-300 italic font-serif">
            {comment.createdAt}
          </span>
        </div>

        <p className="text-xl md:text-2xl font-light text-slate-800 leading-relaxed tracking-tight group-hover:text-slate-900 transition-colors">
          {comment.content}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <button
            onClick={(e) => onDelete(e, comment.commentId)}
            className="flex items-center gap-2 text-[10px] font-bold text-slate-300 hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </button>

          <Link
            href={`/community/posts/${comment.postId}`}
            className="flex items-center gap-2 text-[11px] font-black text-teal-600 hover:text-slate-900 transition-all uppercase tracking-widest group/link"
          >
            Go to Story{" "}
            <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
