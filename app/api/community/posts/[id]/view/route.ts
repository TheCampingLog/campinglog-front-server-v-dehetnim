import { NextResponse } from "next/server";
import fs from "fs/promises"; // ✅ 비동기 I/O 적용
import path from "path";

const filePath = path.join(process.cwd(), "data", "posts.json");

// 헬퍼: 비동기 데이터 읽기
const readPosts = async () => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = Number(id);

    // ✅ 1. 비동기 읽기 (Non-Blocking)
    const posts = await readPosts();
    const postIndex = posts.findIndex((p: any) => Number(p.postId) === postId);

    if (postIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Not Found" },
        { status: 404 }
      );
    }

    // ✅ 2. 조회수 증가 로직 (Atomic 연산 대용)
    // 자바의 AtomicInteger처럼 완벽한 동시성을 보장하진 않지만,
    // 비동기 구조에서 이벤트 루프를 막지 않아 충돌 위험을 줄입니다.
    posts[postIndex].viewCount = (posts[postIndex].viewCount || 0) + 1;

    // ✅ 3. 비동기 저장 (Write-Back)
    await fs.writeFile(filePath, JSON.stringify(posts, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      viewCount: posts[postIndex].viewCount,
    });
  } catch (error) {
    console.error("View Count Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
