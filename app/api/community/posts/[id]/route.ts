import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const postsPath = path.join(process.cwd(), "data", "posts.json");
const commentsPath = path.join(process.cwd(), "data", "comments.json");
const likesPath = path.join(process.cwd(), "data", "likes.json");
const usersPath = path.join(process.cwd(), "data", "users.json"); // 유저 활동량 업데이트용

const readJson = (filePath: string) => {
  if (!fs.existsSync(filePath)) return [];
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const writeJson = (filePath: string, data: any[]) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// [GET] 상세 조회
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = Number(id);
    const posts = readJson(postsPath);
    const post = posts.find((p: any) => Number(p.postId) === postId);

    if (!post) {
      return NextResponse.json(
        { success: false, message: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "조회 실패" },
      { status: 500 }
    );
  }
}

// [PUT] 수정 (보안 강화 버전)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = Number(id);
    const body = await request.json();
    const posts = readJson(postsPath);

    const postIndex = posts.findIndex((p: any) => Number(p.postId) === postId);
    if (postIndex === -1) {
      return NextResponse.json(
        { success: false, message: "게시글이 없습니다." },
        { status: 404 }
      );
    }

    // ✅ 중요: 수정 가능한 필드만 허용 (보안)
    const { title, content, image, category, rating } = body;

    posts[postIndex] = {
      ...posts[postIndex],
      title: title ?? posts[postIndex].title,
      content: content ?? posts[postIndex].content,
      image: image ?? posts[postIndex].image,
      category: category ?? posts[postIndex].category,
      rating: category === "캠핑장비 리뷰" ? rating : undefined,
      updatedAt: new Date()
        .toLocaleDateString("ko-KR")
        .replace(/\. /g, ".")
        .replace(/\.$/, ""),
    };

    writeJson(postsPath, posts);
    return NextResponse.json({ success: true, message: "수정되었습니다." });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "수정 실패" },
      { status: 500 }
    );
  }
}

// [DELETE] 연쇄 삭제 및 유저 활동량 차감
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = Number(id);

    const posts = readJson(postsPath);
    const postToDelete = posts.find((p: any) => Number(p.postId) === postId);

    if (!postToDelete) {
      return NextResponse.json(
        { success: false, message: "삭제할 게시글이 없습니다." },
        { status: 404 }
      );
    }

    // 1. 게시글 삭제
    const filteredPosts = posts.filter((p: any) => Number(p.postId) !== postId);
    writeJson(postsPath, filteredPosts);

    // 2. 관련 데이터(댓글, 좋아요) 삭제
    const filteredComments = readJson(commentsPath).filter(
      (c: any) => Number(c.postId) !== postId
    );
    writeJson(commentsPath, filteredComments);

    const filteredLikes = readJson(likesPath).filter(
      (l: any) => Number(l.postId) !== postId
    );
    writeJson(likesPath, filteredLikes);

    // 3. ✅ 마이페이지 통계 업데이트 (작성자 활동량 차감)
    const users = readJson(usersPath);
    const userIndex = users.findIndex(
      (u: any) => u.email === postToDelete.authorEmail
    );

    if (userIndex !== -1 && users[userIndex].activity) {
      users[userIndex].activity.boardCount = Math.max(
        0,
        users[userIndex].activity.boardCount - 1
      );
      if (postToDelete.category === "캠핑장비 리뷰") {
        users[userIndex].activity.reviewCount = Math.max(
          0,
          users[userIndex].activity.reviewCount - 1
        );
      }
      writeJson(usersPath, users);
    }

    return NextResponse.json({
      success: true,
      message: "게시글 및 관련 데이터가 모두 삭제되었습니다.",
    });
  } catch (error) {
    console.error("삭제 실패:", error);
    return NextResponse.json(
      { success: false, message: "삭제 실패" },
      { status: 500 }
    );
  }
}
