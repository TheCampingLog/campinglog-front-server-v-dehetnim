import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

const postsPath = path.join(process.cwd(), "data", "posts.json");
const usersPath = path.join(process.cwd(), "data", "users.json");

// 헬퍼: 파일 읽기 (비동기 방식)
const readData = async (filePath: string) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// 🚀 최적화된 파일 쓰기: Indent(공백)를 제거하여 I/O 속도 향상
const writeData = async (filePath: string, data: any[]) => {
  // null, 2를 제거하여 파일 크기를 최소화합니다.
  await fs.writeFile(filePath, JSON.stringify(data), "utf8");
};

// [GET] 모든 게시글 가져오기
export async function GET() {
  try {
    const posts = await readData(postsPath);
    // 자바의 Comparator처럼 정렬
    const sortedPosts = posts.sort((a: any, b: any) => b.postId - a.postId);
    return NextResponse.json(sortedPosts);
  } catch (error) {
    return NextResponse.json({ error: "데이터 로드 실패" }, { status: 500 });
  }
}

// [POST] 새 게시글 등록하기
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    // 1. 데이터 병렬 로드
    const [posts, users] = await Promise.all([
      readData(postsPath),
      readData(usersPath),
    ]);

    const body = await request.json();
    const { title, content, category, author, image, rating } = body;

    // ✅ 2. 중복 등록 방지 (사용자 연타 방어)
    const now = Date.now();
    const isDuplicate = posts.some(
      (p: any) =>
        p.authorEmail === userEmail &&
        p.title === title &&
        now - p.postId < 3000 // 3초 이내 중복 등록 차단
    );

    if (isDuplicate) {
      return NextResponse.json(
        { success: false, message: "이전 요청이 처리 중입니다." },
        { status: 429 }
      );
    }

    // ✅ 3. 이미지 최적화: authorImage를 클라이언트로부터 받지 않고 서버 유저 데이터에서 추출
    // 이를 통해 고용량 Base64 데이터가 JSON에 중복 저장되는 것을 원천 차단합니다.
    const currentUser = users.find((u: any) => u.email === userEmail);
    const finalAuthorImage =
      currentUser?.profileImage || "/image/default-profile.png";

    const newPost = {
      postId: now,
      title,
      content,
      category,
      author,
      authorImage: finalAuthorImage, // ✅ URL 경로만 저장됨
      authorEmail: userEmail,
      image: image || null, // 이미 URL 형태임을 확인
      rating: category === "캠핑장비 리뷰" ? rating : undefined,
      createdAt: new Date()
        .toLocaleDateString("ko-KR")
        .replace(/\. /g, ".")
        .replace(/\.$/, ""),
      viewCount: 0,
      commentCount: 0,
      likeCount: 0,
    };

    // 4. 유저 활동 데이터 업데이트
    const userIndex = users.findIndex((u: any) => u.email === userEmail);
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
      user.activity.boardCount += 1;
      if (category === "캠핑장비 리뷰") {
        user.activity.reviewCount += 1;
      }
    }

    // 5. 병렬 쓰기 수행
    const updatedPosts = [newPost, ...posts];
    await Promise.all([
      writeData(postsPath, updatedPosts),
      writeData(usersPath, users),
    ]);

    return NextResponse.json({
      success: true,
      message: "게시글이 등록되었습니다.",
      post: newPost,
    });
  } catch (error) {
    console.error("게시글 등록 오류:", error);
    return NextResponse.json(
      { success: false, message: "데이터 처리 실패" },
      { status: 500 }
    );
  }
}
