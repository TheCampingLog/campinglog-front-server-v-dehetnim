import { useState, useEffect, useCallback, useMemo } from "react";

export function useEventData() {
  const [activeTab, setActiveTab] = useState("전체");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "전체",
    "꽃축제",
    "문화예술",
    "먹거리",
    "전통축제",
    "레저/스포츠",
  ];

  const fetchEvents = useCallback(async (category: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/localevents?category=${encodeURIComponent(category)}`
      );
      if (!response.ok) throw new Error("데이터 로드 실패");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, events]);

  useEffect(() => {
    fetchEvents(activeTab);
  }, [activeTab, fetchEvents]);

  return {
    activeTab,
    setActiveTab,
    selectedEvent,
    setSelectedEvent,
    isLoading,
    searchQuery,
    setSearchQuery,
    categories,
    filteredEvents,
  };
}
