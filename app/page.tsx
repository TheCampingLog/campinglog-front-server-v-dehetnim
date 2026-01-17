"use client";

import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus, Compass, MoveDown, MapPin } from "lucide-react";
import { usePostStore } from "@/features/member/store/usePostStore";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export default function HomePage() {
  const [isMount, setIsMount] = useState(false);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [localEvents, setLocalEvents] = useState<any[]>([]);
  const { posts, setPosts } = usePostStore();

  useEffect(() => {
    setIsMount(true);
    const fetchData = async () => {
      try {
        const [heroRes, postRes, eventRes] = await Promise.all([
          fetch("/api/home/hero"),
          fetch("/api/community/posts", { cache: "no-store" }),
          fetch("/api/home/events"),
        ]);
        if (heroRes.ok) setHeroSlides(await heroRes.json());
        if (postRes.ok) setPosts(await postRes.json());
        if (eventRes.ok) {
          const eventData = await eventRes.json();
          setLocalEvents(eventData.slice(0, 3));
        }
      } catch (error) {
        console.error("데이터 로드 오류:", error);
      }
    };
    fetchData();
  }, [setPosts]);

  // ✅ 날짜 문자열(2026.03.15)에서 월/일 추출하는 함수
  const parseEventDate = (dateStr: string) => {
    try {
      // "2026.03.15 - 04.10" 같은 형식에서 앞부분 추출
      const startDate = dateStr.split(" - ")[0];
      const parts = startDate.split(".");

      // 월 이름 매핑 (숫자를 영문 월로 변경)
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

      return {
        month: months[monthIdx] || "DATE",
        day: day || "00",
      };
    } catch (e) {
      return { month: "EVENT", day: "!!" };
    }
  };

  const featuredCamps = posts
    .filter((post) => post.category === "캠핑장 정보")
    .slice(0, 3);

  if (!isMount) return null;

  return (
    <div className="min-h-screen bg-white selection:bg-teal-500 selection:text-white font-sans">
      <Header />

      <main>
        {/* 1. Hero Section (기존 동일) */}
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
              {heroSlides.map((slide) => (
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

        {/* 2. Featured Camps Section (기존 동일) */}
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
                {featuredCamps.slice(1, 3).map((camp) => (
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

        {/* 3. Local Events Section: 날짜 파싱 적용 ✅ */}
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
              {localEvents.map((event, idx) => {
                // ✅ 날짜 데이터에서 월/일 추출
                const { month, day } = parseEventDate(event.date);

                return (
                  <Link
                    key={event.id}
                    href="/localevents"
                    className={`group block ${
                      idx === 1 ? "md:-translate-y-12" : ""
                    } transition-all duration-700`}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] mb-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] bg-white">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* ✅ 동적 날짜 뱃지 적용 */}
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

        {/* 4. Brand Guide: Editorial Storytelling Section ✅ */}
        <section className="relative py-60 bg-white overflow-hidden">
          {/* 배경 대형 텍스트 (시각적 깊이감) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-slate-50 leading-none select-none italic font-serif pointer-events-none">
            Archive
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-24 lg:gap-16">
              {/* 좌측: 복합 이미지 레이아웃 */}
              <div className="lg:w-1/2 relative w-full h-[600px]">
                {/* 메인 큰 이미지 */}
                <div className="absolute top-0 left-0 w-4/5 h-[500px] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] z-20 group">
                  <Image
                    src="/image/main-hero-3.jpg"
                    alt="guide main"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>

                {/* 겹쳐진 작은 이미지 (플로팅 효과) */}
                <div className="absolute bottom-0 right-0 w-3/5 h-[350px] rounded-[3rem] overflow-hidden shadow-2xl z-30 border-[12px] border-white group">
                  <Image
                    src="/image/tip-banner.jpg"
                    alt="guide detail"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>

                {/* 인증 뱃지 (회전 애니메이션 개선) */}
                <div className="absolute -top-10 -right-4 w-40 h-40 bg-teal-500 rounded-full flex items-center justify-center text-center text-white shadow-2xl z-40 animate-spin-slow border-4 border-white backdrop-blur-sm bg-teal-500/90">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase leading-tight">
                      Pro <br /> Camper <br /> Choice
                    </span>
                  </div>
                </div>
              </div>

              {/* 우측: 텍스트 및 콘텐츠 */}
              <div className="lg:w-1/2 flex flex-col items-start text-left lg:pl-12">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-12 h-[2px] bg-teal-500" />
                  <span className="text-teal-600 text-[11px] font-black uppercase tracking-[0.5em]">
                    Our Philosophy
                  </span>
                </div>

                <h3 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter italic font-serif mb-12">
                  Elevate <br />
                  Your <span className="text-teal-500 not-italic">Vibe.</span>
                </h3>

                <div className="space-y-6 max-w-lg mb-16">
                  <p className="text-xl text-slate-600 font-medium leading-relaxed italic font-serif">
                    "캠핑은 단순히 머무는 것이 아니라, <br /> 자연과 조우하는
                    방식의 예술입니다."
                  </p>
                  <p className="text-base text-slate-400 font-light leading-relaxed">
                    우리는 당신의 아웃도어 라이프가 단순한 숙박을 넘어 하나의
                    영감이 되길 바랍니다. 전문가들이 엄선한 장비 팁부터 숨겨진
                    명소까지, 당신만의 완벽한 캠핑 시나리오를 완성해보세요.
                  </p>
                </div>

                <Link
                  href="/tips"
                  className="group relative flex items-center gap-6"
                >
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-white transition-all duration-500 group-hover:bg-teal-500 group-hover:scale-110 shadow-xl">
                    <ArrowUpRight className="w-8 h-8 transition-transform group-hover:rotate-45" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">
                      Get Inspired
                    </span>
                    <span className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 group-hover:text-teal-500 group-hover:border-teal-500 transition-colors">
                      Explore Our Expert Guide
                    </span>
                  </div>
                </Link>
              </div>
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
