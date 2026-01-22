import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises"; // ✅ 비동기 처리
import path from "path";

const commentsPath = path.join(process.cwd(), "data", "comments.json");
const postsPath = path.join(process.cwd(), "data", "posts.json");
const usersPath = path.join(process.cwd(), "data", "users.json");

// 헬퍼: 파일 읽기
const readData = async (filePath: string) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// 🚀 최적화된 파일 쓰기: Indent 제거하여 I/O 성능 극대화
const writeData = async (filePath: string, data: any[]) => {
  await fs.writeFile(filePath, JSON.stringify(data), "utf8");
};

// [GET] 특정 게시글의 댓글 목록 조회
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  const allComments = await readData(commentsPath);

  if (postId) {
    const filtered = allComments.filter(
      (c: any) => Number(c.postId) === Number(postId)
    );
    return NextResponse.json(filtered);
  }
  return NextResponse.json(allComments);
}

// [POST] 댓글 등록
export async function POST(request: Request) {
  try {
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

    // 1. 모든 데이터 비동기 병렬 읽기
    const [allComments, posts, users] = await Promise.all([
      readData(commentsPath),
      readData(postsPath),
      readData(usersPath),
    ]);

    const body = await request.json();
    const { postId, content, author } = body; // 🚀 authorImage는 body에서 받지 않고 users에서 추출

    // 2. 작성자 최신 정보 조회 (Base64 방지)
    const currentUser = users.find(
      (u: any) => u.email?.toLowerCase() === userEmail
    );
    const finalAuthorImage =
      currentUser?.profileImage || "/image/default-profile.png";

    // 3. 새 댓글 객체 생성
    const newComment = {
      commentId: Date.now(),
      postId: Number(postId),
      content,
      author,
      authorImage: finalAuthorImage, // ✅ 경로(URL)만 저장
      authorEmail: userEmail,
      createdAt: new Date()
        .toLocaleDateString("ko-KR")
        .replace(/\. /g, ".")
        .replace(/\.$/, ""),
    };

    // 4. 데이터 업데이트 (게시글 댓글 수 및 유저 활동량)
    const postIndex = posts.findIndex(
      (p: any) => Number(p.postId) === Number(postId)
    );
    if (postIndex !== -1) {
      posts[postIndex].commentCount = (posts[postIndex].commentCount || 0) + 1;
    }

    const userIndex = users.findIndex(
      (u: any) => u.email?.toLowerCase() === userEmail
    );
    if (userIndex !== -1) {
      if (!users[userIndex].activity) {
        users[userIndex].activity = {
          boardCount: 0,
          commentCount: 0,
          reviewCount: 0,
          likeCount: 0,
        };
      }
      users[userIndex].activity.commentCount += 1;
    }

    // 5. 모든 변경사항 비동기 병렬 쓰기
    await Promise.all([
      writeData(commentsPath, [newComment, ...allComments]),
      writeData(postsPath, posts),
      writeData(usersPath, users),
    ]);

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    console.error("댓글 등록 오류:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// [DELETE] 댓글 삭제
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = Number(searchParams.get("commentId"));
    const cookieStore = await cookies();
    const userEmail = cookieStore
      .get("user_email")
      ?.value?.trim()
      .toLowerCase();

    const [allComments, posts, users] = await Promise.all([
      readData(commentsPath),
      readData(postsPath),
      readData(usersPath),
    ]);

    const targetComment = allComments.find(
      (c: any) => c.commentId === commentId
    );

    if (
      !targetComment ||
      targetComment.authorEmail?.toLowerCase() !== userEmail
    ) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    // 1. 데이터 필터링 (삭제)
    const filteredComments = allComments.filter(
      (c: any) => c.commentId !== commentId
    );

    // 2. 게시글 댓글 수 감소
    const postIndex = posts.findIndex(
      (p: any) => Number(p.postId) === Number(targetComment.postId)
    );
    if (postIndex !== -1) {
      posts[postIndex].commentCount = Math.max(
        0,
        (posts[postIndex].commentCount || 0) - 1
      );
    }

    // 3. 유저 활동량 감소
    const userIndex = users.findIndex(
      (u: any) => u.email?.toLowerCase() === userEmail
    );
    if (userIndex !== -1 && users[userIndex].activity) {
      users[userIndex].activity.commentCount = Math.max(
        0,
        users[userIndex].activity.commentCount - 1
      );
    }

    // 4. 병렬 쓰기
    await Promise.all([
      writeData(commentsPath, filteredComments),
      writeData(postsPath, posts),
      writeData(usersPath, users),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
