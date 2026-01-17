"use client";

import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Info } from "lucide-react"; // 안내 아이콘 추가

const koreaTopoJson =
  "https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2013/json/skorea_provinces_topo.json";

interface CampingMapProps {
  onRegionClick: (regionId: string) => void;
  selectedRegion: string;
}

export default function CampingMap({
  onRegionClick,
  selectedRegion,
}: CampingMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const getRegionId = (fullName: string) => {
    if (fullName.includes("경상북도")) return "경북";
    if (fullName.includes("경상남도")) return "경남";
    if (fullName.includes("충청북도")) return "충북";
    if (fullName.includes("충청남도")) return "충남";
    if (fullName.includes("전라북도")) return "전북";
    if (fullName.includes("전라남도")) return "전남";
    return fullName.slice(0, 2);
  };

  const getSelectedFullName = () => {
    if (selectedRegion === "전체") return "대한민국 전체";
    const fullNameMap: Record<string, string> = {
      서울: "서울특별시",
      경기: "경기도",
      강원: "강원특별자치도",
      경북: "경상북도",
      경남: "경상남도",
      충북: "충청북도",
      충남: "충청남도",
      전북: "전북특별자치도",
      전남: "전라남도",
      제주: "제주특별자치도",
      인천: "인천광역시",
      부산: "부산광역시",
      대구: "대구광역시",
      광주: "광주광역시",
      대전: "대전광역시",
      울산: "울산광역시",
      세종: "세종특별자치시",
    };
    return fullNameMap[selectedRegion] || selectedRegion;
  };

  return (
    <div className="flex flex-col items-center w-full group/map">
      {/* --- 1. 상단 정보 영역 --- */}
      <div className="mb-6 w-full flex justify-between items-end px-1 border-b border-slate-100 pb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">
            Regional Index
          </span>
          <h3 className="text-3xl font-black text-teal-500 tracking-tighter transition-all duration-300">
            {hoveredRegion ? hoveredRegion : getSelectedFullName()}
          </h3>
        </div>
      </div>

      {/* --- 2. 지도 및 플로팅 버튼 영역 --- */}
      <div className="relative w-full overflow-visible">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ rotate: [-127.6, -35.8, 0], scale: 5800 }}
          width={500}
          height={650}
          className="w-full h-auto"
        >
          <Geographies geography={koreaTopoJson}>
            {({ geographies }) =>
              geographies.map((geo: any) => {
                const fullName = geo.properties.name;
                const regionId = getRegionId(fullName);
                const isSelected = selectedRegion === regionId;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => onRegionClick(regionId)}
                    onMouseEnter={() => setHoveredRegion(fullName)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    style={{
                      default: {
                        fill: isSelected ? "#0D9488" : "#F1F5F9",
                        stroke: isSelected ? "#0D9488" : "#CBD5E1",
                        strokeWidth: 1.0,
                        outline: "none",
                        transition: "all 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
                      },
                      hover: {
                        fill: isSelected ? "#0D9488" : "#E2E8F0",
                        stroke: isSelected ? "#0D9488" : "#94A3B8",
                        strokeWidth: 1.5,
                        outline: "none",
                        cursor: "pointer",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* 플로팅 '전체 지역 보기' 버튼 */}
        <div className="absolute bottom-4 right-0">
          <button
            onClick={() => onRegionClick("전체")}
            className={`group flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-500 ${
              selectedRegion === "전체"
                ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                : "bg-white/80 backdrop-blur-md border border-slate-100 text-slate-400 hover:text-teal-600 hover:border-teal-500 shadow-sm"
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
              전체 지역 보기
            </span>
            <div
              className={`w-1.5 h-1.5 rounded-full bg-teal-500 transition-all duration-500 group-hover:w-6 ${
                selectedRegion === "전체" ? "bg-white" : ""
              }`}
            />
          </button>
        </div>

        {/* 장식 요소 */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-slate-100 opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-slate-100 opacity-50 pointer-events-none" />
      </div>

      {/* ✅ [추가] 하단 안내 문구 영역 */}
      <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 self-start lg:self-center">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
        </div>
        <p className="text-[11px] font-bold text-slate-500 tracking-tight">
          지도를 클릭하면 해당 지역의 캠핑장 정보를{" "}
          <span className="text-teal-600 font-black">실시간으로 아카이브</span>
          합니다.
        </p>
      </div>
    </div>
  );
}
