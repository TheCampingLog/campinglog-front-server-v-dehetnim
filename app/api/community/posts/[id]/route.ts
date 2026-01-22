import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const postsPath = path.join(process.cwd(), "data", "posts.json");
const commentsPath = path.join(process.cwd(), "data", "comments.json");
const likesPath = path.join(process.cwd(), "data", "likes.json");
const usersPath = path.join(process.cwd(), "data", "users.json");

// 헬퍼 함수: JSON 읽기 (비동기)
const readJson = async (filePath: string) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// 헬퍼 함수: JSON 쓰기 (비동기)
const writeJson = async (filePath: string, data: any[]) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
};

// [GET] 상세 조회
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = Number(id);

    const posts = await readJson(postsPath);
    let post = posts.find((p: any) => Number(p.postId) === postId);

    // 🚀 재시도 로직: 파일 쓰기 지연 방어
    if (!post) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const retryPosts = await readJson(postsPath);
      post = retryPosts.find((p: any) => Number(p.postId) === postId);
    }

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// [PUT] 수정 (Dirty Checking 스타일)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = Number(id);
    const body = await request.json();
    const posts = await readJson(postsPath);

    const postIndex = posts.findIndex((p: any) => Number(p.postId) === postId);
    if (postIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Not Found" },
        { status: 404 }
      );
    }

    const { title, content, image, category, rating } = body;

    posts[postIndex] = {
      ...posts[postIndex],
      title: title ?? posts[postIndex].title,
      content: content ?? posts[postIndex].content,
      image: image ?? posts[postIndex].image,
      category: category ?? posts[postIndex].category,
      rating: category === "캠핑장비 리뷰" ? rating : undefined,
      updatedAt: new Date().toISOString().split("T")[0].replace(/-/g, "."),
    };

    await writeJson(postsPath, posts);
    return NextResponse.json({ success: true, message: "Updated" });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// [DELETE] 연쇄 삭제 및 통계 동기화 (Transaction 개념 적용)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = Number(id);

    // 1. 모든 데이터 병렬 로드
    const [posts, comments, likes, users] = await Promise.all([
      readJson(postsPath),
      readJson(commentsPath),
      readJson(likesPath),
      readJson(usersPath),
    ]);

    const postToDelete = posts.find((p: any) => Number(p.postId) === postId);
    if (!postToDelete) {
      return NextResponse.json(
        { success: false, message: "Not Found" },
        { status: 404 }
      );
    }

    // 2. 물리적 연쇄 삭제 (Cascade Delete)
    const filteredPosts = posts.filter((p: any) => Number(p.postId) !== postId);
    const filteredComments = comments.filter(
      (c: any) => Number(c.postId) !== postId
    );
    const filteredLikes = likes.filter((l: any) => Number(l.postId) !== postId);

    // 🚀 3. 유저 활동 통계 업데이트 (Synchronization)
    const authorEmail = postToDelete.authorEmail?.trim().toLowerCase();
    const userIndex = users.findIndex(
      (u: any) => u.email?.trim().toLowerCase() === authorEmail
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

      // 게시글 수 차감
      user.activity.boardCount = Math.max(
        0,
        (user.activity.boardCount || 0) - 1
      );

      // 리뷰 게시글인 경우 리뷰 수 차감
      if (postToDelete.category === "캠핑장비 리뷰") {
        user.activity.reviewCount = Math.max(
          0,
          (user.activity.reviewCount || 0) - 1
        );
      }

      // 🎯 핵심: 게시글이 삭제될 때 해당 글이 받았던 좋아요 수만큼 작성자의 '받은 좋아요' 카운트 차감
      const likesOnThisPost = likes.filter(
        (l: any) => Number(l.postId) === postId
      ).length;
      user.activity.likeCount = Math.max(
        0,
        (user.activity.likeCount || 0) - likesOnThisPost
      );
    }

    // 4. 모든 변경사항 병렬 저장 (Atomic Write)
    await Promise.all([
      writeJson(postsPath, filteredPosts),
      writeJson(commentsPath, filteredComments),
      writeJson(likesPath, filteredLikes),
      writeJson(usersPath, users),
    ]);

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
