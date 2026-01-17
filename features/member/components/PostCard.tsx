import Link from "next/link";
import Image from "next/image";
import { Eye, MessageSquare, Trash2, ChevronRight } from "lucide-react";

// Props 타입 정의
interface PostCardProps {
  post: any;
  onDelete: (e: React.MouseEvent, postId: number) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  return (
    <Link
      href={`/community/posts/${post.postId}`}
      className="group block relative bg-white border border-slate-50 hover:border-teal-100 hover:shadow-2xl hover:shadow-teal-900/5 rounded-3xl p-6 transition-all duration-500"
    >
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* 이미지 영역 */}
        <div className="relative w-full md:w-48 aspect-[4/3] shrink-0 overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={post.image || "/image/default-camp.jpg"}
            alt={post.title}
            fill
            sizes="200px"
            className="object-cover group-hover:scale-110 transition-transform duration-1000"
          />
        </div>

        {/* 정보 영역 */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-[9px] font-black text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
              {post.category}
            </span>
            <span className="text-[11px] font-medium text-slate-300">
              {post.createdAt}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-teal-700 transition-colors">
            {post.title}
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Eye className="w-4 h-4" />
              <span className="text-xs font-bold">{post.viewCount}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs font-bold">{post.commentCount}</span>
            </div>
          </div>
        </div>

        {/* 액션 영역 */}
        <div className="flex items-center gap-4 md:flex-col md:justify-center md:border-l md:border-slate-50 md:pl-8">
          <button
            onClick={(e) => onDelete(e, post.postId)}
            className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <div className="hidden md:flex p-3 bg-slate-50 text-slate-300 rounded-2xl group-hover:bg-teal-500 group-hover:text-white transition-all">
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
