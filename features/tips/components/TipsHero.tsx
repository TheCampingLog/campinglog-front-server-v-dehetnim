"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export default function TipsHero() {
  return (
    <section className="pt-32 pb-20 px-6 border-b border-slate-50">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-500 mb-6">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Camping Essentials
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-light mb-8 font-serif italic tracking-tight text-slate-900">
          Beginner's Guide
        </h1>
        <p className="text-slate-400 font-light max-w-2xl mx-auto leading-relaxed text-lg">
          캠핑의 시작이 두렵지 않도록, 전문가들의 노하우를 <br />
          감성적인 매거진 형식으로 담아 전달합니다.
        </p>
      </div>
    </section>
  );
}
