"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Cloud,
  Sun,
  Wind,
  Navigation,
  CloudRain,
  Snowflake,
  Zap,
} from "lucide-react";
// 분리된 훅 임포트
import { useWeather } from "../hooks/useWeather";
import { useMemberActivity } from "../hooks/useMemberActivity";

export function ActivitySummary() {
  const [isMount, setIsMount] = useState(false);

  // 훅에서 데이터 가져오기
  const weather = useWeather();
  const { counts } = useMemberActivity();

  useEffect(() => {
    setIsMount(true);
  }, []);

  const getWeatherConfig = (condition: string) => {
    switch (condition) {
      case "Rain":
        return {
          icon: <CloudRain className="w-8 h-8" />,
          color: "from-blue-600 to-slate-800",
          text: "Rainy Day",
        };
      case "Snow":
        return {
          icon: <Snowflake className="w-8 h-8" />,
          color: "from-slate-200 to-blue-100 text-slate-800",
          text: "Snowy",
        };
      case "Clouds":
        return {
          icon: <Cloud className="w-8 h-8" />,
          color: "from-slate-500 to-slate-700",
          text: "Cloudy",
        };
      default:
        return {
          icon: <Sun className="w-8 h-8" />,
          color: "from-orange-400 to-rose-500",
          text: "Sunny",
        };
    }
  };

  const weatherConfig = getWeatherConfig(weather.condition);

  if (!isMount) return null;

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* --- 상단 날씨 섹션 --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div
          className={`lg:col-span-3 rounded-[2.5rem] overflow-hidden relative group transition-all duration-700 bg-gradient-to-br ${weatherConfig.color} p-1`}
        >
          <div className="bg-black/10 backdrop-blur-sm w-full h-full rounded-[2.4rem] p-8 text-white flex flex-col md:flex-row justify-between relative overflow-hidden">
            <div className="relative z-10 flex flex-col justify-between space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {weatherConfig.text}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/70">
                    <Navigation className="w-3 h-3" /> {weather.location}
                  </div>
                </div>
                <h4 className="text-5xl md:text-6xl font-black tracking-tighter italic font-serif leading-none">
                  {weather.temp}
                  <span className="text-2xl font-normal not-italic ml-1 opacity-80">
                    °C
                  </span>
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-xs">
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/5">
                  <div className="flex items-center gap-2 text-white/60 mb-1">
                    <Wind className="w-3 h-3" />{" "}
                    <span className="text-[10px] font-bold">WIND</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black">{weather.wind}</span>
                    <span className="text-[10px] opacity-60">m/s</span>
                  </div>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/5">
                  <div className="flex items-center gap-2 text-white/60 mb-1">
                    <Zap className="w-3 h-3" />{" "}
                    <span className="text-[10px] font-bold">TIPS</span>
                  </div>
                  <p className="text-[11px] leading-tight font-medium line-clamp-2">
                    {weather.tip}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center md:items-end md:justify-end gap-2 relative z-10">
              <div className="w-full md:w-48 h-12 bg-white/20 rounded-2xl flex items-center justify-between px-4 backdrop-blur-xl border border-white/10 group-hover:bg-white/30 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-tighter">
                  Camping Score
                </span>
                <span className="text-xl font-black italic font-serif">
                  {weather.wind > 8 ? "30" : "95"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center group hover:bg-slate-200 transition-colors">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:rotate-12 bg-white shadow-lg">
            <div
              className={weather.wind > 8 ? "text-rose-500" : "text-teal-500"}
            >
              {weatherConfig.icon}
            </div>
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Status
          </span>
          <h5 className="text-lg font-black text-slate-900 leading-none">
            {weather.wind > 8 ? "Caution" : "Stable"}
          </h5>
        </div>
      </div>

      {/* --- 활동 내역 그리드 --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "My Posts", value: counts.posts, href: "/mypage/posts" },
          {
            label: "Comments",
            value: counts.comments,
            href: "/mypage/comments",
          },
          {
            label: "Equipment Reviews",
            value: counts.reviews,
            href: "/mypage/reviews",
          },
          { label: "Saved Vibes", value: counts.likes, href: "/mypage/likes" },
        ].map((stat, index) => (
          <Link
            href={stat.href}
            key={index}
            className="group relative bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-teal-100 transition-all duration-500 overflow-hidden"
          >
            <span className="absolute -bottom-2 -right-2 text-6xl font-black text-slate-50 group-hover:text-teal-50/50 transition-colors pointer-events-none font-serif italic">
              0{index + 1}
            </span>
            <div className="relative z-10 text-left">
              <div className="flex justify-between items-start mb-6">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] group-hover:text-teal-600 transition-colors">
                  {stat.label}
                </p>
                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
                  <ArrowUpRight className="w-3 h-3 text-slate-300 group-hover:text-teal-500" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <p className="text-4xl font-black text-slate-900 tracking-tighter italic font-serif">
                  {stat.value}
                </p>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1">
                  items
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
