"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ChevronDown, LogIn } from "lucide-react";
import { useUserStore } from "@/features/member/store/useUserStore";
import { useLikeStore } from "@/features/member/store/useLikeStore";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCommunityHovered, setIsCommunityHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Zustand 상태 및 함수
  const { nickname, profileImage, email, clearUser } = useUserStore();
  const { syncWithServer, clearLikes } = useLikeStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 로그인 상태일 때 서버와 좋아요 데이터 동기화
  useEffect(() => {
    const fetchAndSyncLikes = async () => {
      if (!email || !isMounted) return;

      try {
        const res = await fetch("/api/members/likes");
        if (res.ok) {
          const likedPostsData = await res.json();
          syncWithServer(likedPostsData);
        }
      } catch (err) {
        console.error("좋아요 동기화 중 오류 발생:", err);
      }
    };

    fetchAndSyncLikes();
  }, [email, isMounted, syncWithServer]);

  // ✅ 최적화된 로그아웃 핸들러
  const handleLogout = async () => {
    if (!confirm("정말 로그아웃 하시겠습니까?")) return;

    try {
      // 1. 서버 측 쿠키 삭제 API 호출
      const res = await fetch("/api/auth/logout", { method: "POST" });

      if (res.ok) {
        // 2. 클라이언트 상태(Zustand) 소거
        clearUser();
        clearLikes();

        // 3. 로컬 스토리지에 저장된 Persist 데이터 강제 삭제 (보안 강화)
        localStorage.clear();

        alert("로그아웃 되었습니다.");

        // 4. 모든 상태를 초기화하며 홈으로 강제 이동
        window.location.replace("/");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      alert("로그아웃 처리 중 오류가 발생했습니다.");
    }
  };
  // 스크롤 제어
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 검색창 열릴 때 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = isSearchOpen ? "hidden" : "unset";
  }, [isSearchOpen]);

  if (!isMounted) return null;

  return (
    <>
      {/* 검색창 배경 오버레이 */}
      <div
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-[1px] z-40 transition-opacity duration-300 ${
          isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="sticky top-0 z-50 w-full">
        <header
          className={`w-full border-b border-slate-100 bg-white/95 backdrop-blur-md transition-all duration-300 ${
            isScrolled ? "h-14 shadow-sm" : "h-20"
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
            <div className="flex items-center gap-12 h-full">
              {/* 로고 영역 */}
              <Link
                href="/"
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <div
                  className={`transition-all duration-300 ${
                    isScrolled ? "scale-90" : "scale-100"
                  }`}
                >
                  <Image
                    src="/image/camping-log-logo.png"
                    alt="Camping Log"
                    width={isScrolled ? 110 : 130}
                    height={40}
                    priority
                    className="object-contain w-auto h-auto"
                  />
                </div>
              </Link>

              {/* 네비게이션 */}
              <nav className="hidden lg:flex items-center gap-10 text-[13px] font-bold text-slate-500 tracking-tight h-full">
                {/* 🏕️ 캠핑장 메뉴 추가 */}
                <Link
                  href="/camping"
                  className="hover:text-slate-900 transition-colors flex items-center gap-1"
                >
                  캠핑장
                </Link>

                <div
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setIsCommunityHovered(true)}
                  onMouseLeave={() => setIsCommunityHovered(false)}
                >
                  <Link
                    href="/community"
                    className="flex items-center gap-1 hover:text-slate-900 transition-colors py-2"
                  >
                    커뮤니티
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        isCommunityHovered ? "rotate-180" : ""
                      }`}
                    />
                  </Link>
                  {/* 드롭다운 메뉴 */}
                  <div
                    className={`absolute top-full left-0 w-40 bg-white border border-slate-100 shadow-xl rounded-sm py-2 transition-all duration-300 z-50 ${
                      isCommunityHovered
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <Link
                      href="/community?tab=캠핑장 정보"
                      className="block px-5 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all font-medium text-[12px]"
                    >
                      캠핑장 정보
                    </Link>
                    <Link
                      href="/community?tab=캠핑장비 리뷰"
                      className="block px-5 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all font-medium text-[12px]"
                    >
                      캠핑장비 리뷰
                    </Link>
                  </div>
                </div>
                <Link
                  href="/localevents"
                  className="hover:text-slate-900 transition-colors"
                >
                  지역축제
                </Link>
                <Link
                  href="/tips"
                  className="hover:text-slate-900 transition-colors"
                >
                  초보꿀팁
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-6">
              {/* 검색 버튼 */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 transition-colors ${
                  isSearchOpen
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {isSearchOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>

              {/* 인증 정보 영역 */}
              <div className="flex items-center gap-4">
                {email ? (
                  <>
                    <Link
                      href="/mypage"
                      className={`flex items-center gap-3 rounded-full border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all ${
                        isScrolled ? "pl-1 pr-4 py-1" : "pl-1.5 pr-5 py-1.5"
                      }`}
                    >
                      <div
                        className={`relative rounded-full overflow-hidden border border-white shadow-sm transition-all ${
                          isScrolled ? "w-7 h-7" : "w-8 h-8"
                        }`}
                      >
                        <Image
                          src={profileImage || "/image/default-profile.png"}
                          alt="Profile"
                          fill
                          // ✅ 성능 최적화를 위해 sizes 추가
                          sizes="32px"
                          className="object-cover"
                          unoptimized={profileImage?.startsWith("data:")}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600">
                        {nickname}
                      </span>
                    </Link>
                    <button
                      className="hidden sm:block text-[10px] font-black text-slate-300 hover:text-red-500 transition-colors uppercase tracking-widest"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all shadow-sm"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-black uppercase tracking-widest">
                      Login
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* 검색창 내부 */}
        <div
          className={`w-full bg-white border-b border-slate-100 overflow-hidden transition-all duration-500 ease-in-out ${
            isSearchOpen
              ? "max-h-24 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 h-24 flex items-center">
            <form className="w-full flex items-center gap-4 bg-slate-50 px-6 py-3.5 rounded-full border border-slate-100 focus-within:bg-white focus-within:border-slate-300 focus-within:shadow-sm transition-all">
              <input
                type="text"
                placeholder="어떤 캠핑 정보가 궁금하신가요?"
                className="w-full bg-transparent border-none outline-none text-base font-medium text-slate-700 placeholder:text-slate-300"
              />
              <button
                type="submit"
                className="p-2 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition-colors shadow-md"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
