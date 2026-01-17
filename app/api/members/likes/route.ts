import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const likesPath = path.join(process.cwd(), "data", "likes.json");
const postsPath = path.join(process.cwd(), "data", "posts.json");

const readData = (filePath: string) => {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const allLikes = readData(likesPath);
    const allPosts = readData(postsPath);

    // 1. 내 좋아요 기록 찾기
    const myLikes = allLikes.filter((l: any) => l.email === userEmail);
    const myLikedPostIds = myLikes.map((l: any) => l.postId);

    // 2. 실제 존재하는 게시글만 필터링 (유령 데이터 제거)
    const likedPosts = allPosts.filter((p: any) =>
      myLikedPostIds.includes(p.postId)
    );

    // [선택 사항] 3. 만약 유령 데이터를 likes.json에서도 완전히 지우고 싶다면?
    // 실제 존재하는 글의 ID만 남긴 likes 리스트를 다시 저장하는 로직을 추가할 수 있습니다.

    return NextResponse.json(likedPosts.reverse());
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
