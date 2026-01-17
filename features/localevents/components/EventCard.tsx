"use client";

import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface EventCardProps {
  event: any;
  index: number;
  onClick: (event: any) => void;
}

export default function EventCard({ event, index, onClick }: EventCardProps) {
  return (
    <div
      className="group flex flex-col cursor-pointer opacity-0 animate-[slide-up_0.8s_ease-out_forwards]"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onClick(event)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] mb-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-700 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] group-hover:-translate-y-3">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full">
          <span className="text-[10px] font-black uppercase tracking-tighter text-slate-800">
            Ongoing
          </span>
        </div>
      </div>
      <div className="px-1">
        <div className="flex items-center gap-2 mb-3 text-teal-600">
          <MapPin className="w-3.5 h-3.5 opacity-40" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
            {event.location}
          </span>
        </div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-[1.1] group-hover:text-teal-500 transition-colors">
          {event.title}
        </h3>
      </div>
    </div>
  );
}
