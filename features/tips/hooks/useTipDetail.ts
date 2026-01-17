import { useState, useEffect } from "react";

export function useTipDetail(id: string | string[] | undefined) {
  const [tip, setTip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTipDetail = async () => {
    try {
      await fetch(`/api/tips/${id}/view`, { method: "POST" });
      const response = await fetch(`/api/tips/${id}`);
      if (!response.ok) throw new Error("Not found");
      const data = await response.json();
      setTip(data);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTipDetail();
  }, [id]);

  return { tip, isLoading };
}
