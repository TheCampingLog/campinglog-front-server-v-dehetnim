import { NextResponse } from "next/server";
import fs from "fs/promises"; // ✅ 비동기 처리
import path from "path";

const postsPath = path.join(process.cwd(), "data", "posts.json");
const commentsPath = path.join(process.cwd(), "data", "comments.json");
const likesPath = path.join(process.cwd(), "data", "likes.json");

// 헬퍼 함수
const readJson = async (p: string) => {
  try {
    const data = await fs.readFile(p, "utf8");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 🚀 데이터 병렬 로드 (성능 최적화)
    const [allPosts, allComments, allLikes] = await Promise.all([
      readJson(postsPath),
      readJson(commentsPath),
      readJson(likesPath),
    ]);

    // 1. 유효한(삭제되지 않은) 게시글 ID Set 생성
    // 자바의 HashSet과 유사하게 O(1) 검색 속도를 보장합니다.
    const validPostIds = new Set(allPosts.map((p: any) => Number(p.postId)));

    // 2. 내 게시글 필터링
    const myPosts = allPosts.filter(
      (p: any) => p.authorEmail?.toLowerCase() === email
    );

    // 🚀 3. 활동량 계산 (참조 무결성 로직 적용)
    const activity = {
      // 일반 게시글 수
      posts: myPosts.filter((p: any) => p.category !== "캠핑장비 리뷰").length,

      // 리뷰 게시글 수
      reviews: myPosts.filter((p: any) => p.category === "캠핑장비 리뷰")
        .length,

      // ✅ 댓글 수 (핵심 수정): 내 댓글이면서 + 원문 게시글이 존재하는 경우만 카운트!
      // 이 로직이 들어가야 마이페이지 리스트(3개)와 대시보드(3개)가 일치하게 됩니다.
      comments: allComments.filter(
        (c: any) =>
          c.authorEmail?.toLowerCase() === email &&
          validPostIds.has(Number(c.postId))
      ).length,

      // 좋아요 수 (마찬가지로 게시글이 존재하는 경우만)
      likes: allLikes.filter(
        (l: any) =>
          (l.email?.toLowerCase() === email ||
            l.nickname?.toLowerCase() === email) &&
          validPostIds.has(Number(l.postId))
      ).length,
    };

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Activity API Error:", error);
    return NextResponse.json({ posts: 0, reviews: 0, comments: 0, likes: 0 });
  }
}
