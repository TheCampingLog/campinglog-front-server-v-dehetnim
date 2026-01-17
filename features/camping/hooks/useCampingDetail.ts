import { useState, useEffect } from "react";

export function useCampingDetail(id: string) {
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/camping/${id}`);
        const data = await res.json();
        setSite(data);
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  return { site, loading };
}
