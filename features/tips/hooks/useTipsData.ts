import { useState, useEffect } from "react";

export function useTipsData() {
  const [tips, setTips] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTips = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tips");
      const data = await response.json();
      if (Array.isArray(data)) {
        setTips(data);
      } else {
        setTips([]);
      }
    } catch (error) {
      console.error(error);
      setTips([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const filteredTips = Array.isArray(tips)
    ? selectedCategory === "ALL"
      ? tips
      : tips.filter((tip) => tip.category === selectedCategory)
    : [];

  return { filteredTips, selectedCategory, setSelectedCategory, isLoading };
}
