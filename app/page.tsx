"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query"; // ✅ 추가
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus, Compass, MoveDown } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export default function HomePage() {
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setIsMount(true);
  }, []);

  // ✅ [React Query 1] Hero 슬라이드 데이터 조회
  const { data: heroSlides = [] } = useQuery({
    queryKey: ["home", "hero"],
    queryFn: () => fetch("/api/home/hero").then((res) => res.json()),
    staleTime: 1000 * 60 * 60, // 1시간 캐싱
  });

  // ✅ [React Query 2] 전체 포스트 데이터 조회 (기존 usePostStore 대체)
  const { data: allPosts = [] } = useQuery({
    queryKey: ["posts", "all"],
    queryFn: () => fetch("/api/community/posts").then((res) => res.json()),
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });

  // ✅ [React Query 3] 로컬 이벤트 데이터 조회
  const { data: localEvents = [] } = useQuery({
    queryKey: ["home", "events"],
    queryFn: () =>
      fetch("/api/home/events")
        .then((res) => res.json())
        .then((data) => data.slice(0, 3)),
    staleTime: 1000 * 60 * 30, // 30분 캐싱
  });

  // ✅ 비즈니스 로직 처리 (자바의 Service 레이어 역할)
  const featuredCamps = allPosts
    .filter((post: any) => post.category === "캠핑장 정보")
    .slice(0, 3);

  // 날짜 파싱 함수 (기존 동일)
  const parseEventDate = (dateStr: string) => {
    try {
      const startDate = dateStr.split(" - ")[0];
      const parts = startDate.split(".");
      const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
      const monthIdx = parseInt(parts[1]) - 1;
      const day = parts[2];
      return { month: months[monthIdx] || "DATE", day: day || "00" };
    } catch (e) {
      return { month: "EVENT", day: "!!" };
    }
  };

  if (!isMount) return null;

  return (
    <div className="min-h-screen bg-white selection:bg-teal-500 selection:text-white font-sans">
      <Header />
      <main>
        {/* 1. Hero Section */}
        <section className="relative h-screen w-full overflow-hidden bg-slate-900">
          {heroSlides.length > 0 ? (
            <Swiper
              modules={[Autoplay, EffectFade, Pagination]}
              effect="fade"
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              speed={1500}
              pagination={{ clickable: true }}
              loop={true}
              className="w-full h-full"
            >
              {heroSlides.map((slide: any) => (
                <SwiperSlide key={slide.id} className="relative w-full h-full">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover scale-105 animate-subtle-zoom"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-6 opacity-80">
                      Beyond the Horizon
                    </span>
                    <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter italic font-serif leading-[0.9]">
                      {slide.title.split(" ").map((word: string, i: number) => (
                        <span key={i} className="block">
                          {word}
                        </span>
                      ))}
                    </h2>
                    <p className="text-lg font-light opacity-80 mb-12 max-w-xl mx-auto">
                      {slide.subtitle}
                    </p>
                    <Link
                      href="/community"
                      className="group flex items-center gap-3 px-10 py-4 bg-white text-slate-900 rounded-full transition-all duration-500 hover:bg-teal-500 hover:text-white shadow-2xl"
                    >
                      <span className="text-[11px] font-black uppercase tracking-widest">
                        Explore Now
                      </span>
                      <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900 animate-pulse" />
          )}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white animate-bounce opacity-50">
            <MoveDown className="w-6 h-6" />
          </div>
        </section>

        {/* 2. Featured Camps Section */}
        <section className="max-w-7xl mx-auto px-6 py-40 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-end mb-24">
            <div className="lg:col-span-8">
              <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.4em] mb-4 block">
                Seasonal Pick
              </span>
              <h3 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none italic font-serif">
                The Best <br /> Camping Archive
              </h3>
            </div>
            <div className="lg:col-span-4 pb-2">
              <p className="text-slate-400 font-light leading-relaxed mb-8">
                커뮤니티 멤버들이 공유한 가장 생생한 캠핑장 아카이브입니다.
              </p>
              <Link
                href="/community"
                className="group flex items-center gap-2 text-[11px] font-black text-slate-900 border-b-2 border-slate-900 pb-1 hover:text-teal-600 hover:border-teal-600 transition-all uppercase tracking-widest"
              >
                View Collection{" "}
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          {featuredCamps.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8">
                <Link href={`/community/posts/${featuredCamps[0].postId}`}>
                  <div className="relative h-[600px] rounded-[2.5rem] overflow-hidden group shadow-2xl">
                    <Image
                      src={featuredCamps[0].image || "/image/default-camp.jpg"}
                      alt={featuredCamps[0].title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-12 left-12 text-white">
                      <span className="px-3 py-1 bg-teal-500 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                        Featured
                      </span>
                      <h4 className="text-4xl md:text-5xl font-black italic font-serif">
                        {featuredCamps[0].title}
                      </h4>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-10">
                {featuredCamps.slice(1, 3).map((camp: any) => (
                  <Link
                    href={`/community/posts/${camp.postId}`}
                    key={camp.postId}
                    className="flex-1"
                  >
                    <div className="relative h-full min-h-[280px] rounded-[2.5rem] overflow-hidden group shadow-lg">
                      <Image
                        src={camp.image || "/image/default-camp.jpg"}
                        alt={camp.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all" />
                      <div className="absolute bottom-8 left-8 text-white">
                        <p className="text-xl font-bold italic font-serif leading-tight">
                          {camp.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center border-y border-slate-50 text-slate-300 italic font-serif">
              No camp data found.
            </div>
          )}
        </section>

        {/* 3. Local Events Section */}
        <section className="bg-[#FBFBF9] py-40 overflow-hidden relative border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-24 text-center md:text-left">
              <div className="max-w-2xl">
                <span className="text-teal-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
                  Curated Experiences
                </span>
                <h3 className="text-5xl md:text-7xl font-black italic font-serif leading-none tracking-tighter text-slate-900">
                  Local <span className="text-slate-300 not-italic">&</span>{" "}
                  Journey
                </h3>
              </div>
              <Link
                href="/localevents"
                className="mt-8 md:mt-0 group flex items-center gap-3 text-[11px] font-black tracking-widest uppercase bg-white px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all border border-slate-100 text-slate-900"
              >
                View All Events{" "}
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {localEvents.map((event: any, idx: number) => {
                const { month, day } = parseEventDate(event.date);
                return (
                  <Link
                    key={event.id}
                    href="/localevents"
                    className={`group block ${
                      idx === 1 ? "md:-translate-y-12" : ""
                    } transition-all duration-700`}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] mb-10 shadow-lg bg-white">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute top-8 right-8">
                        <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full flex flex-col items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                          <span className="text-[10px] font-black text-teal-600 uppercase leading-none mb-0.5">
                            {month}
                          </span>
                          <span className="text-lg font-black text-slate-900 leading-none">
                            {day}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-2">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">
                          {event.category}
                        </span>
                        <div className="w-8 h-[1px] bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {event.location}
                        </span>
                      </div>
                      <h4 className="text-3xl font-black tracking-tighter text-slate-900 italic font-serif leading-none mb-4 group-hover:text-teal-600 transition-colors">
                        {event.title}
                      </h4>
                      <p className="text-sm text-slate-500 font-light leading-relaxed line-clamp-2 italic">
                        {event.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes subtle-zoom {
          from {
            transform: scale(1.05);
          }
          to {
            transform: scale(1.15);
          }
        }
        .animate-subtle-zoom {
          animation: subtle-zoom 20s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}
