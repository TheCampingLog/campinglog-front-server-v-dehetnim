"use client";

import { useParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import TipDetailHeader from "@/features/tips/components/TipDetailHeader";
import TipDetailContent from "@/features/tips/components/TipDetailContent";
import { useTipDetail } from "@/features/tips/hooks/useTipDetail";

export default function TipDetailPage() {
  const { id } = useParams();
  const { tip, isLoading } = useTipDetail(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-slate-400 animate-pulse font-serif italic">
          Reading Article...
        </p>
      </div>
    );
  }

  if (!tip) return null;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="pt-32 pb-32">
        <TipDetailHeader tip={tip} />
        <TipDetailContent tip={tip} />
      </main>
      <Footer />
    </div>
  );
}
