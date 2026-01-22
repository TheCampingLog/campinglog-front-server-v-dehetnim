import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

const postsPath = path.join(process.cwd(), "data", "posts.json");
const likesPath = path.join(process.cwd(), "data", "likes.json");
const usersPath = path.join(process.cwd(), "data", "users.json");

const readData = async (p: string) => {
  try {
    const data = await fs.readFile(p, "utf8");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const writeData = async (p: string, d: any) => {
  await fs.writeFile(p, JSON.stringify(d, null, 2), "utf8");
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = Number(id);
    const { isLiked, nickname } = await request.json();

    const cookieStore = await cookies();
    const userEmail = cookieStore
      .get("user_email")
      ?.value?.trim()
      .toLowerCase();

    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const [posts, allLikes, users] = await Promise.all([
      readData(postsPath),
      readData(likesPath),
      readData(usersPath),
    ]);

    const postIndex = posts.findIndex((p: any) => Number(p.postId) === postId);
    if (postIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // ✅ 1. 내가 이 게시글에 좋아요를 눌렀었는지 체크
    const alreadyExists = allLikes.some(
      (l: any) =>
        Number(l.postId) === postId &&
        l.email?.trim().toLowerCase() === userEmail
    );

    let updatedLikes = [...allLikes];
    let likeChanged = false;

    // ✅ 2. 비즈니스 로직 (좋아요 추가/취소)
    if (isLiked && !alreadyExists) {
      updatedLikes.unshift({
        postId,
        nickname,
        email: userEmail,
        createdAt: new Date().toISOString(),
      });
      posts[postIndex].likeCount = (posts[postIndex].likeCount || 0) + 1;
      likeChanged = true;
    } else if (!isLiked && alreadyExists) {
      updatedLikes = allLikes.filter(
        (l: any) =>
          !(
            Number(l.postId) === postId &&
            l.email?.trim().toLowerCase() === userEmail
          )
      );
      posts[postIndex].likeCount = Math.max(
        0,
        (posts[postIndex].likeCount || 0) - 1
      );
      likeChanged = true;
    }

    // ✅ 3. 통계 데이터 동기화 (누른 사람 본인의 activity 업데이트)
    if (likeChanged) {
      const userIndex = users.findIndex(
        (u: any) => u.email?.trim().toLowerCase() === userEmail
      );

      if (userIndex !== -1) {
        const user = users[userIndex];
        if (!user.activity) {
          user.activity = {
            boardCount: 0,
            commentCount: 0,
            reviewCount: 0,
            likeCount: 0,
          };
        }

        // 🚀 "내가 누른 좋아요" 수 업데이트
        user.activity.likeCount = isLiked
          ? (user.activity.likeCount || 0) + 1
          : Math.max(0, (user.activity.likeCount || 0) - 1);
      }

      await Promise.all([
        writeData(postsPath, posts),
        writeData(likesPath, updatedLikes),
        writeData(usersPath, users),
      ]);
    }

    return NextResponse.json({
      success: true,
      likeCount: posts[postIndex].likeCount,
    });
  } catch (error) {
    console.error("Like Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
