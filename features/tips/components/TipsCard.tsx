"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface TipsCardProps {
  tip: any;
}

export default function TipsCard({ tip }: TipsCardProps) {
  return (
    <Link href={`/tips/${tip.id}`} className="group">
      <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-slate-50 mb-8">
        <Image
          src={tip.image}
          alt={tip.title}
          fill
          className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
          priority={tip.id <= 2}
        />
      </div>
      <div className="flex flex-col gap-4 text-left">
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-amber-600">
          <span>{tip.category}</span>
          <span className="w-1 h-1 bg-slate-200 rounded-full" />
          <span className="text-slate-400 font-medium tracking-normal capitalize">
            {tip.date}
          </span>
        </div>
        <h3 className="text-3xl font-light text-slate-900 group-hover:text-slate-500 transition-colors font-serif italic leading-tight">
          {tip.title}
        </h3>
        <p className="text-slate-500 font-light leading-relaxed line-clamp-2 text-[15px]">
          {tip.description}
        </p>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 mt-2 border-b border-slate-900 w-fit pb-1 group-hover:gap-4 transition-all">
          Read Article <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
