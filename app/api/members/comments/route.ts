import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises"; // ✅ 비동기 파일 시스템 적용
import path from "path";

const commentsPath = path.join(process.cwd(), "data", "comments.json");
const postsPath = path.join(process.cwd(), "data", "posts.json");
const usersPath = path.join(process.cwd(), "data", "users.json");

// 헬퍼 함수: 비동기 JSON 읽기/쓰기
const readJson = async (p: string) => {
  try {
    const data = await fs.readFile(p, "utf8");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const writeJson = async (p: string, d: any) => {
  await fs.writeFile(p, JSON.stringify(d, null, 2), "utf8");
};

// [GET] 내 댓글 목록 조회
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🚀 병렬 데이터 로드 (자바의 parallelStream과 유사한 효과)
    const [allComments, allPosts] = await Promise.all([
      readJson(commentsPath),
      readJson(postsPath),
    ]);

    // 1. 내 댓글 필터링
    const myComments = allComments.filter(
      (c: any) => c.authorEmail === userEmail
    );

    // 2. 게시글 데이터와 조인 (Inner Join 느낌으로 필터링)
    const enrichedComments = myComments
      .map((comment: any) => {
        const parentPost = allPosts.find(
          (p: any) => Number(p.postId) === Number(comment.postId)
        );

        // 🚀 핵심: 게시글이 없으면 null 반환 (나중에 filter로 제거)
        if (!parentPost) return null;

        return {
          ...comment,
          postTitle: parentPost.title,
        };
      })
      // ✅ 3. 삭제된 게시글에 달린 댓글은 리스트에서 아예 제거 (데이터 무결성 보장)
      .filter((c: any) => c !== null)
      .sort((a: any, b: any) => b.commentId - a.commentId);

    return NextResponse.json(enrichedComments);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// [POST] 댓글 등록
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail)
      return NextResponse.json({ success: false }, { status: 401 });

    const body = await request.json();
    const { postId, content, author, authorImage } = body;

    const [allComments, allPosts, users] = await Promise.all([
      readJson(commentsPath),
      readJson(postsPath),
      readJson(usersPath),
    ]);

    const currentUser = users.find((u: any) => u.email === userEmail);
    const finalAuthorImage =
      currentUser?.profileImage || authorImage || "/image/default-profile.png";

    const newComment = {
      commentId: Date.now(),
      postId: Number(postId),
      content,
      author,
      authorImage: finalAuthorImage,
      authorEmail: userEmail,
      createdAt: new Date()
        .toLocaleDateString("ko-KR")
        .replace(/\. /g, ".")
        .replace(/\.$/, ""),
    };

    // 데이터 업데이트 로직
    const postIndex = allPosts.findIndex(
      (p: any) => Number(p.postId) === Number(postId)
    );
    const userIndex = users.findIndex((u: any) => u.email === userEmail);

    if (postIndex !== -1)
      allPosts[postIndex].commentCount =
        (allPosts[postIndex].commentCount || 0) + 1;
    if (userIndex !== -1) {
      if (!users[userIndex].activity)
        users[userIndex].activity = {
          boardCount: 0,
          commentCount: 0,
          reviewCount: 0,
          likeCount: 0,
        };
      users[userIndex].activity.commentCount += 1;
    }

    // 🚀 일괄 비동기 저장 (트랜잭션 원자성 확보 노력)
    await Promise.all([
      writeJson(commentsPath, [newComment, ...allComments]),
      writeJson(postsPath, allPosts),
      writeJson(usersPath, users),
    ]);

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// [DELETE] 댓글 삭제
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = Number(searchParams.get("commentId"));
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    const [allComments, allPosts, users] = await Promise.all([
      readJson(commentsPath),
      readJson(postsPath),
      readJson(usersPath),
    ]);

    const targetComment = allComments.find(
      (c: any) => c.commentId === commentId
    );

    if (!targetComment || targetComment.authorEmail !== userEmail) {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    const filteredComments = allComments.filter(
      (c: any) => c.commentId !== commentId
    );

    // 게시물 및 유저 카운트 업데이트
    const postIndex = allPosts.findIndex(
      (p: any) => Number(p.postId) === Number(targetComment.postId)
    );
    const userIndex = users.findIndex((u: any) => u.email === userEmail);

    if (postIndex !== -1)
      allPosts[postIndex].commentCount = Math.max(
        0,
        allPosts[postIndex].commentCount - 1
      );
    if (userIndex !== -1 && users[userIndex].activity)
      users[userIndex].activity.commentCount = Math.max(
        0,
        users[userIndex].activity.commentCount - 1
      );

    await Promise.all([
      writeJson(commentsPath, filteredComments),
      writeJson(postsPath, allPosts),
      writeJson(usersPath, users),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
