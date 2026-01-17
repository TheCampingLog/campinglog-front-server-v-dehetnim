import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const postsPath = path.join(process.cwd(), "data", "posts.json");

export async function GET(request: Request) {
  try {
    // 1. 로그인 유저 확인 (쿠키 기반)
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. 페이지네이션 파라미터 추출
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 5;

    // 3. posts.json 데이터 읽기
    if (!fs.existsSync(postsPath)) {
      return NextResponse.json({
        content: [],
        totalPages: 0,
        totalElements: 0,
        size: limit,
        number: page,
      });
    }

    const fileData = fs.readFileSync(postsPath, "utf8");
    const allPosts = JSON.parse(fileData);

    // 4. 필터링 로직: (내 이메일) AND (카테고리가 '캠핑장비 리뷰')
    const myReviews = allPosts.filter(
      (post: any) =>
        post.authorEmail === userEmail && post.category === "캠핑장비 리뷰"
    );

    // 5. 최신순 정렬 (postId 기준)
    myReviews.sort((a: any, b: any) => b.postId - a.postId);

    // 6. 페이지네이션 계산
    const totalElements = myReviews.length;
    const totalPages = Math.ceil(totalElements / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    const paginatedReviews = myReviews.slice(start, end);

    // 7. 기존 응답 구조 유지 (프론트엔드 호환성)
    return NextResponse.json(
      {
        content: paginatedReviews,
        totalPages: totalPages,
        totalElements: totalElements,
        size: limit,
        number: page,
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    console.error("Fetch My Reviews Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
