"use client";

import React from "react";
import TipsCard from "./TipsCard";

interface TipsListGridProps {
  tips: any[];
}

export default function TipsListGrid({ tips }: TipsListGridProps) {
  if (tips.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400 font-serif italic">
          준비된 콘텐츠가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
      {tips.map((tip) => (
        <TipsCard key={tip.id} tip={tip} />
      ))}
    </div>
  );
}
