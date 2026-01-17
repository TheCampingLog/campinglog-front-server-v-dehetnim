"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Tent } from "lucide-react";

interface CampingCardProps {
  contentId: string;
  facltNm: string;
  addr1: string;
  firstImageUrl?: string;
  lineIntro?: string;
  induty?: string;
  tel?: string;
}

export default function CampingCard({
  contentId,
  facltNm,
  addr1,
  firstImageUrl,
  lineIntro,
  induty,
  tel,
}: CampingCardProps) {
  // 기본 이미지 경로
  const defaultImg = "/image/default-camp.jpg";

  // 초기 이미지 설정: URL이 비어있으면 즉시 기본 이미지 사용
  const initialImg =
    firstImageUrl && firstImageUrl.trim() !== "" ? firstImageUrl : defaultImg;
  const [imgSrc, setImgSrc] = useState(initialImg);

  // 데이터(Props)가 바뀌면 이미지 상태도 다시 확인 (필터링 대응)
  useEffect(() => {
    setImgSrc(
      firstImageUrl && firstImageUrl.trim() !== "" ? firstImageUrl : defaultImg
    );
  }, [firstImageUrl]);

  return (
    <Link href={`/camping/${contentId || ""}`} className="block h-full">
      <div className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer">
        {/* 이미지 영역 */}
        <div className="relative h-52 w-full bg-slate-100 shrink-0">
          <Image
            src={imgSrc}
            alt={facltNm || "캠핑장 이미지"} // alt 에러 방지
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgSrc(defaultImg)} // 로드 실패 시 교체
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-teal-600 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">
              <Tent className="w-3 h-3" />
              <span className="uppercase">{induty || "일반야영장"}</span>
            </div>
          </div>
        </div>

        {/* 텍스트 영역 */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-teal-600 transition-colors">
            {facltNm || "정보 없음"}
          </h3>
          <p className="text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px] leading-relaxed">
            {lineIntro || "자연과 함께하는 힐링 캠핑장입니다."}
          </p>

          <div className="mt-auto space-y-2.5 border-t border-slate-50 pt-5">
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span className="line-clamp-1">
                {addr1 || "주소 정보가 없습니다."}
              </span>
            </div>
            {tel && (
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <Phone className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                <span>{tel}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
