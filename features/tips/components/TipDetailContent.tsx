import Image from "next/image";
import { BookOpen } from "lucide-react";

export default function TipDetailContent({ tip }: { tip: any }) {
  return (
    <>
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="relative aspect-[21/9] overflow-hidden rounded-sm bg-slate-100 shadow-sm">
          <Image
            src={tip.image}
            alt={tip.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
      <article className="max-w-2xl mx-auto px-6">
        <div className="text-slate-700 leading-[2.2] text-lg font-light whitespace-pre-line first-letter:text-5xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:text-slate-900">
          {tip.content}
        </div>
        <div className="mt-24 pt-12 border-t border-slate-100">
          <div className="flex items-center gap-4 bg-slate-50 p-8 rounded-sm">
            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Camping Editor</p>
              <p className="text-xs text-slate-400 font-light mt-1">
                캠퍼들의 즐거운 시작을 돕는 캠핑 전문 가이드 아티클입니다.
              </p>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
