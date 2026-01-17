import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const commentsPath = path.join(process.cwd(), "data", "comments.json");
const postsPath = path.join(process.cwd(), "data", "posts.json");
const usersPath = path.join(process.cwd(), "data", "users.json");

// 헬퍼 함수들
const readData = (p: string) =>
  fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : [];
const writeData = (p: string, d: any) =>
  fs.writeFileSync(p, JSON.stringify(d, null, 2), "utf8");

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allComments = readData(commentsPath);
    const allPosts = readData(postsPath);

    // 1. 내 이메일로 작성된 댓글만 필터링
    const myComments = allComments.filter(
      (c: any) => c.authorEmail === userEmail
    );

    // 2. 게시글 데이터와 결합하여 '원문 제목' 추가
    const enrichedComments = myComments
      .map((comment: any) => {
        const parentPost = allPosts.find(
          (p: any) => p.postId === comment.postId
        );
        return {
          ...comment,
          postTitle: parentPost ? parentPost.title : "삭제된 게시글입니다.",
        };
      })
      .sort((a: any, b: any) => b.commentId - a.commentId); // 최신순 정렬

    return NextResponse.json(enrichedComments);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const body = await request.json();
    // ✅ authorImage를 추가로 받습니다.
    const { postId, content, author, authorImage } = body;

    // ✅ 최신 유저 정보에서 프로필 이미지를 가져와 데이터 일관성 유지
    const users = readData(usersPath);
    const currentUser = users.find((u: any) => u.email === userEmail);
    const finalAuthorImage =
      currentUser?.profileImage || authorImage || "/image/default-profile.png";

    const allComments = readData(commentsPath);
    const newComment = {
      commentId: Date.now(),
      postId: Number(postId),
      content,
      author,
      authorImage: finalAuthorImage, // ✅ 필드 추가 저장
      authorEmail: userEmail,
      createdAt: new Date()
        .toLocaleDateString("ko-KR")
        .replace(/\. /g, ".")
        .replace(/\.$/, ""),
    };

    writeData(commentsPath, [newComment, ...allComments]);

    // ✅ 1. 게시글의 댓글 수(commentCount) 증가
    const posts = readData(postsPath);
    const postIndex = posts.findIndex((p: any) => p.postId === Number(postId));
    if (postIndex !== -1) {
      posts[postIndex].commentCount = (posts[postIndex].commentCount || 0) + 1;
      writeData(postsPath, posts);
    }

    // ✅ 2. 유저 활동량(commentCount) 증가
    const userIndex = users.findIndex((u: any) => u.email === userEmail);
    if (userIndex !== -1) {
      if (!users[userIndex].activity)
        users[userIndex].activity = {
          boardCount: 0,
          commentCount: 0,
          reviewCount: 0,
          likeCount: 0,
        };
      users[userIndex].activity.commentCount += 1;
      writeData(usersPath, users);
    }

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    console.error("댓글 등록 오류:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = Number(searchParams.get("commentId"));
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    const allComments = readData(commentsPath);
    const targetComment = allComments.find(
      (c: any) => c.commentId === commentId
    );

    if (!targetComment || targetComment.authorEmail !== userEmail) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    writeData(
      commentsPath,
      allComments.filter((c: any) => c.commentId !== commentId)
    );

    // ✅ 3. 게시글 댓글 수 감소
    const posts = readData(postsPath);
    const postIndex = posts.findIndex(
      (p: any) => p.postId === targetComment.postId
    );
    if (postIndex !== -1) {
      posts[postIndex].commentCount = Math.max(
        0,
        posts[postIndex].commentCount - 1
      );
      writeData(postsPath, posts);
    }

    // ✅ 4. 유저 활동량 감소
    const users = readData(usersPath);
    const userIndex = users.findIndex((u: any) => u.email === userEmail);
    if (userIndex !== -1 && users[userIndex].activity) {
      users[userIndex].activity.commentCount = Math.max(
        0,
        users[userIndex].activity.commentCount - 1
      );
      writeData(usersPath, users);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
