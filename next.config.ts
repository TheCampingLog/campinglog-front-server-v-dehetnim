import type { NextConfig } from "next";
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gocamping.or.kr",
        port: "",
        pathname: "/**",
      },
      // (선택사항) 나중에 다른 외부 이미지도 쓸 거라면 아래처럼 추가할 수 있어요.
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
