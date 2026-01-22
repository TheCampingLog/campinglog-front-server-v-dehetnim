"use client"; // 클라이언트 전역 상태를 다루므로 반드시 추가

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 컴포넌트 생명주기 동안 단 한 번만 QueryClient를 생성하도록 설정
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 '신선'하게 유지 (캐시 활용)
            retry: 1, // 실패 시 1번만 재시도
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 하단에 캐시 상태를 볼 수 있는 디버깅 도구 추가 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
