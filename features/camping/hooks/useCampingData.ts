"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CampingSite } from "@/types/camping";

export function useCampingData() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allSites, setAllSites] = useState<CampingSite[]>([]);
  const [displaySites, setDisplaySites] = useState<CampingSite[]>([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState(searchParams.get("k") || "");
  const [filterDo, setFilterDo] = useState(searchParams.get("do") || "");
  const [filterSi, setFilterSi] = useState(searchParams.get("si") || "");
  const [selectedRegion, setSelectedRegion] = useState(
    searchParams.get("do") || "전체"
  );
  const [displayTitle, setDisplayTitle] = useState(
    searchParams.get("do") || "전체"
  );

  const normalizeDoName = useCallback((name: string) => {
    if (!name || name === "전체") return "";
    const names: Record<string, string> = {
      서울: "서울",
      경기: "경기",
      인천: "인천",
      강원: "강원",
      제주: "제주",
      세종: "세종",
      부산: "부산",
      대구: "대구",
      광주: "광주",
      대전: "대전",
      울산: "울산",
    };
    for (const key in names) if (name.includes(key)) return names[key];
    if (name.includes("충남") || name.includes("충청남도")) return "충남";
    if (name.includes("충북") || name.includes("충청북도")) return "충북";
    if (name.includes("경남") || name.includes("경상남도")) return "경남";
    if (name.includes("경북") || name.includes("경상북도")) return "경북";
    if (name.includes("전남") || name.includes("전라남도")) return "전남";
    if (name.includes("전북") || name.includes("전라북도")) return "전북";
    return name;
  }, []);

  const updateURL = useCallback(
    (dos: string, si: string, key: string) => {
      const params = new URLSearchParams();
      if (dos) params.set("do", dos);
      if (si) params.set("si", si);
      if (key) params.set("k", key);
      router.replace(`/camping?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const handleApplyFilters = useCallback(
    (
      regionDo: string,
      regionSi: string,
      searchKey: string,
      sourceData?: CampingSite[]
    ) => {
      const baseData = sourceData || allSites;
      let filtered = [...baseData];
      if (regionDo && regionDo !== "전체")
        filtered = filtered.filter((s) => s.doNm === regionDo);
      if (regionSi) filtered = filtered.filter((s) => s.sigunguNm === regionSi);
      if (searchKey) {
        const lowerKey = searchKey.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.facltNm.toLowerCase().includes(lowerKey) ||
            s.addr1.toLowerCase().includes(lowerKey)
        );
      }
      setDisplaySites(filtered);
    },
    [allSites]
  );

  useEffect(() => {
    async function initData() {
      setLoading(true);
      try {
        const res = await fetch("/api/camping/list");
        const data = await res.json();
        const listData = Array.isArray(data) ? data : data.items || [];
        const normalizedData = listData.map((site: any) => ({
          ...site,
          doNm: normalizeDoName(site.doNm),
        }));
        setAllSites(normalizedData);
        handleApplyFilters(
          searchParams.get("do") || "",
          searchParams.get("si") || "",
          searchParams.get("k") || "",
          normalizedData
        );
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    }
    initData();
  }, []);

  const handleRegionClick = (regionId: string) => {
    const normalized = normalizeDoName(regionId);
    setSelectedRegion(regionId);
    setFilterDo(regionId === "전체" ? "" : normalized);
    setFilterSi("");
    setDisplayTitle(regionId);
    handleApplyFilters(normalized, "", keyword);
    updateURL(normalized, "", keyword);
  };

  const handleDoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFilterDo(val);
    setFilterSi("");
    setSelectedRegion(val || "전체");
    setDisplayTitle(val || "전체");
    handleApplyFilters(val, "", keyword);
    updateURL(val, "", keyword);
  };

  const handleSiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFilterSi(val);
    handleApplyFilters(filterDo, val, keyword);
    updateURL(filterDo, val, keyword);
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeyword(val);
    handleApplyFilters(filterDo, filterSi, val);
    updateURL(filterDo, filterSi, val);
  };

  const resetAll = () => {
    setFilterDo("");
    setFilterSi("");
    setKeyword("");
    setSelectedRegion("전체");
    setDisplayTitle("전체");
    setDisplaySites(allSites);
    router.replace("/camping", { scroll: false });
  };

  const doList = useMemo(
    () =>
      Array.from(new Set(allSites.map((s) => s.doNm)))
        .filter(Boolean)
        .sort(),
    [allSites]
  );
  const sigunguList = useMemo(() => {
    if (!filterDo) return [];
    return Array.from(
      new Set(
        allSites.filter((s) => s.doNm === filterDo).map((s) => s.sigunguNm)
      )
    )
      .filter(Boolean)
      .sort();
  }, [filterDo, allSites]);

  return {
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
  };
}
