import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "posts.json");

// 헬퍼: 안전하게 읽기
const readPosts = () => {
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, "utf8");
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

    let posts = readPosts();
    const postIndex = posts.findIndex((p: any) => Number(p.postId) === postId);

    if (postIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Not Found" },
        { status: 404 }
      );
    }

    // 조회수 증가
    posts[postIndex].viewCount = (posts[postIndex].viewCount || 0) + 1;

    // 저장
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      viewCount: posts[postIndex].viewCount,
    });
  } catch (error) {
    console.error("View Count Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
