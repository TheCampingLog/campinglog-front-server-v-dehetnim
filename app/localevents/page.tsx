"use client";

import { useEffect } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

// 분리된 컴포넌트들 임포트
import EventHero from "@/features/localevents/components/EventHero";
import EventCategoryNav from "@/features/localevents/components/EventCategoryNav";
import EventListGrid from "@/features/localevents/components/EventListGrid";
import EventBottomSheet from "@/features/localevents/components/EventBottomSheet";

// 로직 처리를 위한 커스텀 훅 (아래 작성 가이드 참고)
import { useEventData } from "@/features/localevents/hooks/useEventData";

export default function LocalEventsPage() {
  const {
    activeTab,
    setActiveTab,
    selectedEvent,
    setSelectedEvent,
    isLoading,
    searchQuery,
    setSearchQuery,
    categories,
    filteredEvents,
  } = useEventData();

  // 스크롤 제어 로직만 페이지 레벨에서 유지
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedEvent]);

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <div className="fixed top-0 left-0 w-full z-[100] bg-white">
        <Header />
      </div>

      {/* 메인 콘텐츠 영역: 상세 보기 시 축소 애니메이션 포함 */}
      <main
        className={`bg-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] origin-top min-h-screen ${
          selectedEvent
            ? "scale-[0.95] opacity-40 rounded-b-[3.5rem] pointer-events-none shadow-2xl"
            : "scale-100 opacity-100 rounded-none"
        }`}
      >
        {/* 1. 상단 비주얼 영역 */}
        <EventHero />

        {/* 2. 카테고리 및 검색 네비게이션 */}
        <EventCategoryNav
          categories={categories}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* 3. 이벤트 리스트 그리드 (로딩/결과없음 처리 포함) */}
        <EventListGrid
          isLoading={isLoading}
          filteredEvents={filteredEvents}
          onEventSelect={setSelectedEvent}
        />

        <Footer />
      </main>

      {/* 4. 상세 정보 바텀 시트 */}
      <EventBottomSheet
        selectedEvent={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {/* 전역 애니메이션 스타일 */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
