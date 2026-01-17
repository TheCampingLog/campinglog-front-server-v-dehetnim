import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const postsPath = path.join(process.cwd(), "data", "posts.json");

export async function GET(request: Request) {
  try {
    // 1. 로그인 유저 확인
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. 페이지네이션 파라미터 추출
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 5;

    // 3. posts.json 데이터 읽기 및 예외 처리
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
    const allPosts = fileData ? JSON.parse(fileData) : [];

    // 4. 내 글만 필터링 (authorEmail 기준) + 캠핑장비 리뷰 제외 ✅
    const myPosts = allPosts.filter((post: any) => {
      const isMine = post.authorEmail === userEmail;
      const isNotReview = post.category !== "캠핑장비 리뷰";
      return isMine && isNotReview;
    });

    // 5. 최신순 정렬 (postId 기반)
    myPosts.sort((a: any, b: any) => Number(b.postId) - Number(a.postId));

    // 6. 페이지네이션 계산
    const totalElements = myPosts.length;
    const totalPages = Math.ceil(totalElements / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    const paginatedPosts = myPosts.slice(start, end);

    // 7. 응답 반환
    return NextResponse.json(
      {
        content: paginatedPosts,
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
    console.error("Fetch My Posts Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
