"use client";

import { useState, useEffect } from "react";

export function useWeather() {
  const [weather, setWeather] = useState({
    temp: 0,
    condition: "Loading...",
    wind: 0,
    location: "위치 파악 중...",
    tip: "날씨 정보를 읽어오고 있습니다.",
    isLoading: true,
  });

  const fetchWeather = async (lat: number, lon: number) => {
    const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (!res.ok) return;

      const temp = Math.round(data?.main?.temp ?? 0);
      const windSpeed = data?.wind?.speed ?? 0;
      const condition = data?.weather?.[0]?.main ?? "Clear";

      let campingTip = "캠핑하기 무난한 날씨예요. 즐거운 시간 되세요!";
      if (windSpeed > 8)
        campingTip = "강풍 주의! 타프는 낮게, 팩다운은 깊게 하세요.";
      if (temp < 5)
        campingTip = "추운 날씨입니다. 일산화탄소 경보기 챙기셨나요?";
      if (condition === "Rain")
        campingTip = "우중 캠핑! 텐트 배수로를 미리 확보하세요.";

      setWeather({
        temp,
        condition,
        wind: windSpeed,
        location: data.name || "알 수 없는 지역",
        tip: campingTip,
        isLoading: false,
      });
    } catch (error) {
      console.error("Weather fetch failed:", error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(37.5665, 126.978) // 기본 위치(서울)
      );
    }
  }, []);

  return weather;
}
