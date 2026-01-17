"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/features/member/store/useUserStore";
import { X } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        clearUser();
        localStorage.clear();

        setUserInfo({
          nickname: data.user.nickname,
          profileImage: data.user.profileImage,
          email: data.user.email,
        });

        setTimeout(() => {
          window.location.replace("/mypage");
        }, 500);
      } else {
        setErrorMessage(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage("서버 통신 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center px-6 text-slate-900 font-sans">
      {/* ✅ 닫기 버튼: 위치를 살짝 안쪽(12)으로 조정하여 시각적 안정감 확보 */}
      <Link
        href="/"
        className="absolute top-12 right-12 p-3 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all duration-300 group z-50"
        aria-label="홈으로 이동"
      >
        <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
      </Link>

      <div className="w-full max-w-md">
        <header className="mb-16 text-center">
          {/* ✅ 타이틀 변경: Identity -> Login. */}
          <h1 className="text-6xl md:text-7xl font-black italic font-serif tracking-tighter mb-4">
            Login.
          </h1>
          <p className="text-slate-400 uppercase tracking-[0.4em] text-[10px] font-bold">
            Camp Vibe Community
          </p>
        </header>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider ml-1 text-slate-400">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="example@domain.com"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all duration-200 placeholder:text-slate-300"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider ml-1 text-slate-400">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="••••••••"
              className={`w-full px-6 py-4 bg-slate-50 border rounded-2xl focus:ring-2 outline-none transition-all duration-200 ${
                errorMessage
                  ? "border-red-400 animate-shake focus:ring-red-100"
                  : "border-slate-100 focus:ring-slate-900"
              }`}
              required
            />
            {errorMessage && (
              <p className="text-[11px] text-red-500 font-bold ml-2 mt-1 italic tracking-tight">
                * {errorMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[12px] hover:bg-slate-800 transition-all active:scale-[0.98] disabled:bg-slate-200 mt-6 shadow-2xl shadow-slate-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-10 text-center text-slate-400 text-[11px] font-medium uppercase tracking-widest">
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="text-slate-900 underline underline-offset-4 font-black hover:text-slate-600 transition-colors"
          >
            회원가입
          </Link>
        </p>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
