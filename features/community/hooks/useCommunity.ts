import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useCommunity(initialTab: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allContent, setAllContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const activeTab = searchParams.get("tab") || "전체";

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/community/posts");
      const data = await res.json();
      const formatted = data
        .map((item: any) => ({
          ...item,
          type: item.category === "캠핑장비 리뷰" ? "review" : "post",
        }))
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      setAllContent(formatted);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredContent = allContent.filter((item) => {
    const matchTab =
      activeTab === "전체" ||
      (activeTab === "캠핑장 정보" &&
        ["정보공유", "후기", "질문", "캠핑장 정보"].includes(item.category)) ||
      (activeTab === "캠핑장비 리뷰" && item.category === "캠핑장비 리뷰");
    const matchSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleTabClick = (tab: string) => {
    setSearchTerm("");
    const path =
      tab === "전체"
        ? "/community"
        : `/community?tab=${encodeURIComponent(tab)}`;
    router.push(path);
  };

  return {
    filteredContent,
    isLoading,
    activeTab,
    searchTerm,
    setSearchTerm,
    handleTabClick,
  };
}
