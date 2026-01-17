"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CampingHero from "@/features/camping/components/CampingHero";
import CampingFilterBar from "@/features/camping/components/CampingFilterBar";
import CampingListGrid from "@/features/camping/components/CampingListGrid";
import { useCampingData } from "@/features/camping/hooks/useCampingData"; // ✅ 커스텀 훅 임포트

export default function CampingListPage() {
  // ✅ 모든 로직을 훅 하나로 가져옵니다.
  const {
    displaySites,
    loading,
    keyword,
    filterDo,
    filterSi,
    selectedRegion,
    displayTitle,
    doList,
    sigunguList,
    handleRegionClick,
    handleDoChange,
    handleSiChange,
    handleKeywordChange,
    resetAll,
  } = useCampingData();

  const regionPhrases: Record<string, string> = {
    전체: "어디로 떠나볼까요?",
    서울: "도심 속 휴식, 서울",
    경기: "부담 없이 훌쩍, 경기도 근교",
    강원: "웅장한 대자연, 강원",
    경북: "역사가 숨쉬는 경북",
    경남: "푸른 바다의 경남",
    충북: "산과 호수의 충북",
    충남: "노을이 예쁜 충남",
    전북: "숨겨진 낙원, 전북",
    전남: "남도 여행의 전남",
    제주: "환상의 섬, 제주",
    인천: "바다 너머 인천",
    세종: "정원 도시 세종",
    울산: "절경을 품은 울산",
    부산: "항구의 낭만, 부산",
    대구: "활기찬 도심, 대구",
    광주: "예술과 맛의 고장, 광주",
    대전: "교통의 중심, 대전",
  };

  return (
    <div className="relative min-h-screen bg-white text-left">
      <Header />
      <main className="relative z-10 flex flex-col items-center">
        <CampingHero
          displayTitle={displayTitle}
          phrase={regionPhrases[displayTitle] || "자연으로 떠나는 여행."}
          selectedRegion={selectedRegion}
          onRegionClick={handleRegionClick}
        />

        <section className="max-w-7xl w-full mx-auto px-6 py-6 pb-40">
          <CampingFilterBar
            total={displaySites.length}
            filterDo={filterDo}
            filterSi={filterSi}
            keyword={keyword}
            doList={doList}
            sigunguList={sigunguList}
            onDoChange={handleDoChange}
            onSiChange={handleSiChange}
            onKeywordChange={handleKeywordChange}
            onReset={resetAll}
          />

          <CampingListGrid loading={loading} items={displaySites} />
        </section>
      </main>
      <Footer />
      <style jsx global>{`
        @keyframes reveal {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
