"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  // 1. 폼 데이터 상태
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
  });

  // 2. 중복 체크 결과 상태
  const [checks, setChecks] = useState({
    email: { verified: false, message: "", isError: false },
    nickname: { verified: false, message: "", isError: false },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 이메일이나 닉네임이 수정되면 다시 중복 체크를 받도록 리셋
    if (name === "email" || name === "nickname") {
      setChecks((prev) => ({
        ...prev,
        [name]: { verified: false, message: "", isError: false },
      }));
    }
    if (errorMessage) setErrorMessage("");
  };

  // ✅ 중복 체크 로직 (API 호출)
  const checkDuplicate = async (type: "email" | "nickname") => {
    const value = formData[type];
    if (!value) {
      alert(`${type === "email" ? "이메일을" : "닉네임을"} 입력해주세요.`);
      return;
    }

    try {
      const res = await fetch(
        `/api/auth/check-duplicate?type=${type}&value=${value}`
      );
      const data = await res.json();

      setChecks((prev) => ({
        ...prev,
        [type]: {
          verified: data.success,
          message: data.message,
          isError: !data.success,
        },
      }));
    } catch (error) {
      console.error("Duplicate Check Error:", error);
    }
  };

  // ✅ 회원가입 제출 핸들러
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // 폼 검증
    if (!checks.email.verified || !checks.nickname.verified) {
      alert("이메일과 닉네임 중복 확인을 완료해주세요.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (formData.password.length < 8) {
      setErrorMessage("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nickname: formData.nickname,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("회원가입이 완료되었습니다! 로그인을 해주세요.");
        router.push("/login");
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage("서버 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center px-6 text-slate-900 font-sans py-20">
      {/* 닫기 버튼 */}
      <Link
        href="/"
        className="absolute top-12 right-12 p-3 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all duration-300 group z-50"
      >
        <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
      </Link>

      <div className="w-full max-w-md">
        <header className="mb-12 text-center">
          <h1 className="text-6xl md:text-7xl font-black italic font-serif tracking-tighter mb-4">
            Join.
          </h1>
          <p className="text-slate-400 uppercase tracking-[0.4em] text-[10px] font-bold">
            Create Your Identity
          </p>
        </header>

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Email + Duplicate Check */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider ml-1 text-slate-400">
              Email Address
            </label>
            <div className="relative">
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@domain.com"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all pr-24"
                required
              />
              <button
                type="button"
                onClick={() => checkDuplicate("email")}
                className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-slate-700 transition-colors"
              >
                Check
              </button>
            </div>
            {checks.email.message && (
              <p
                className={`text-[10px] font-bold ml-2 flex items-center gap-1 ${
                  checks.email.isError ? "text-red-500" : "text-teal-600"
                }`}
              >
                {checks.email.isError ? (
                  <AlertCircle className="w-3 h-3" />
                ) : (
                  <CheckCircle2 className="w-3 h-3" />
                )}
                {checks.email.message}
              </p>
            )}
          </div>

          {/* Nickname + Duplicate Check */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider ml-1 text-slate-400">
              Nickname
            </label>
            <div className="relative">
              <input
                name="nickname"
                type="text"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="어떻게 불러드릴까요?"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all pr-24"
                required
              />
              <button
                type="button"
                onClick={() => checkDuplicate("nickname")}
                className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-slate-700 transition-colors"
              >
                Check
              </button>
            </div>
            {checks.nickname.message && (
              <p
                className={`text-[10px] font-bold ml-2 flex items-center gap-1 ${
                  checks.nickname.isError ? "text-red-500" : "text-teal-600"
                }`}
              >
                {checks.nickname.isError ? (
                  <AlertCircle className="w-3 h-3" />
                ) : (
                  <CheckCircle2 className="w-3 h-3" />
                )}
                {checks.nickname.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider ml-1 text-slate-400">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="최소 8자 이상"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider ml-1 text-slate-400">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호 재입력"
              className={`w-full px-6 py-4 bg-slate-50 border rounded-2xl focus:ring-2 outline-none transition-all ${
                errorMessage && formData.password !== formData.confirmPassword
                  ? "border-red-400 animate-shake focus:ring-red-100"
                  : "border-slate-100 focus:ring-slate-900"
              }`}
              required
            />
            {errorMessage && (
              <p className="text-[11px] text-red-500 font-bold ml-2 mt-2 italic tracking-tight">
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
                <span>Processing...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <footer className="mt-10 text-center">
          <Link
            href="/login"
            className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
          >
            이미 계정이 있으신가요?{" "}
            <span className="underline underline-offset-4 ml-2 text-slate-900 font-black">
              Sign In
            </span>
          </Link>
        </footer>
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
