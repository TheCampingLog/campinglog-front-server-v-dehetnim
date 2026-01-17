import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const postsPath = path.join(process.cwd(), "data", "posts.json");
const likesPath = path.join(process.cwd(), "data", "likes.json");
const usersPath = path.join(process.cwd(), "data", "users.json");

const readData = (filePath: string) => {
  if (!fs.existsSync(filePath)) return [];
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const writeData = (filePath: string, data: any[]) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ Promise 타입으로 정의
) {
  try {
    const { id } = await params;
    const postId = Number(id);
    const { isLiked, nickname } = await request.json();

    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const posts = readData(postsPath);
    const allLikes = readData(likesPath);
    const users = readData(usersPath);

    // 1. 게시글 찾기
    const postIndex = posts.findIndex((p: any) => Number(p.postId) === postId);
    if (postIndex === -1)
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );

    // 2. 좋아요 데이터 처리 및 중복 체크
    const alreadyExists = allLikes.some(
      (l: any) => l.postId === postId && l.email === userEmail
    );
    let updatedLikes = [...allLikes];
    let likeChanged = false;

    if (isLiked && !alreadyExists) {
      // 좋아요 추가
      updatedLikes.unshift({
        postId,
        nickname,
        email: userEmail,
        createdAt: new Date().toISOString(),
      });
      posts[postIndex].likeCount = (posts[postIndex].likeCount || 0) + 1;
      likeChanged = true;
    } else if (!isLiked && alreadyExists) {
      // 좋아요 취소
      updatedLikes = allLikes.filter(
        (l: any) => !(l.postId === postId && l.email === userEmail)
      );
      posts[postIndex].likeCount = Math.max(
        0,
        (posts[postIndex].likeCount || 0) - 1
      );
      likeChanged = true;
    }

    // 3. ✅ 유저 활동 데이터 업데이트 (likeCount 동기화)
    if (likeChanged) {
      const userIndex = users.findIndex((u: any) => u.email === userEmail);
      if (userIndex !== -1) {
        if (!users[userIndex].activity) {
          users[userIndex].activity = {
            boardCount: 0,
            commentCount: 0,
            reviewCount: 0,
            likeCount: 0,
          };
        }
        users[userIndex].activity.likeCount = isLiked
          ? users[userIndex].activity.likeCount + 1
          : Math.max(0, users[userIndex].activity.likeCount - 1);
      }

      // 파일 쓰기
      writeData(postsPath, posts);
      writeData(likesPath, updatedLikes);
      writeData(usersPath, users);
    }

    return NextResponse.json({
      success: true,
      likeCount: posts[postIndex].likeCount,
    });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
