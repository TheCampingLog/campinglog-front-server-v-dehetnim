"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menus = [
    { name: "홈", sub: "Index", href: "/mypage" },
    { name: "내 게시글", sub: "Posts", href: "/mypage/posts" },
    { name: "내 댓글", sub: "Comments", href: "/mypage/comments" },
    { name: "내 리뷰", sub: "Reviews", href: "/mypage/reviews" },
    { name: "좋아요", sub: "Saved", href: "/mypage/likes" },
    { name: "계정 관리", sub: "Account", href: "/mypage/account" },
  ];

  return (
    <div className="w-full bg-white border-t-2 border-slate-900 border-b border-slate-100">
      <nav className="max-w-6xl mx-auto flex items-center overflow-x-auto scrollbar-hide">
        {menus.map((menu) => {
          // 활성화 상태 로직
          const isActive =
            menu.href === "/mypage"
              ? pathname === "/mypage"
              : pathname.startsWith(menu.href);

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`group flex flex-col items-center justify-center px-10 py-6 transition-all relative whitespace-nowrap border-r border-slate-50 last:border-r-0 ${
                isActive ? "bg-slate-50/50" : "hover:bg-slate-50/30"
              }`}
            >
              {/* 영문 서브 타이틀 (세련된 위계) */}
              <span
                className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 transition-colors ${
                  isActive
                    ? "text-teal-600"
                    : "text-slate-300 group-hover:text-slate-400"
                }`}
              >
                {menu.sub}
              </span>

              {/* 한글 메인 메뉴명 */}
              <span
                className={`text-[13px] tracking-tighter transition-all ${
                  isActive
                    ? "text-slate-900 font-black scale-105"
                    : "text-slate-400 font-medium group-hover:text-slate-600"
                }`}
              >
                {menu.name}
              </span>

              {/* 활성화 상태 인디케이터 (커스텀 디자인) */}
              {isActive ? (
                // 활성화 시 하단 굵은 바 + 상단 도트
                <>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-500 rounded-full mt-2" />
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900" />
                </>
              ) : (
                // 비활성화 시 호버 인디케이터
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-slate-200 group-hover:w-1/2 transition-all duration-500" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
