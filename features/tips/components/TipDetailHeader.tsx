import { ArrowLeft, Clock, Eye, Share2 } from "lucide-react";
import Link from "next/link";

export default function TipDetailHeader({ tip }: { tip: any }) {
  return (
    <div className="max-w-3xl mx-auto px-6 mb-12 text-center">
      <Link
        href="/tips"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-widest mb-10"
      >
        <ArrowLeft className="w-3 h-3" /> Back to List
      </Link>
      <div className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 mb-6">
        <span>{tip.category}</span>
        <span className="w-1 h-1 bg-slate-200 rounded-full" />
        <span className="text-slate-400">{tip.date}</span>
      </div>
      <h1 className="text-4xl md:text-6xl font-light leading-tight mb-8 font-serif italic tracking-tight">
        {tip.title}
      </h1>
      <div className="flex items-center justify-center gap-6 text-slate-400 text-[11px] font-medium border-y border-slate-50 py-6">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> {tip.readTime} read
        </div>
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" /> {tip.viewCount || 0} views
        </div>
        <div className="cursor-pointer hover:text-slate-900 transition-colors">
          <Share2 className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
