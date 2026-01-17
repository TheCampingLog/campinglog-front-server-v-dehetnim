import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";

const postsPath = path.join(process.cwd(), "data", "posts.json");
const usersPath = path.join(process.cwd(), "data", "users.json");

// 헬퍼: 파일 읽기
const readData = (filePath: string) => {
  if (!fs.existsSync(filePath)) return [];
  try {
    const data = fs.readFileSync(filePath, "utf8");
    if (!data.trim()) return []; // 파일이 비어있는 경우 빈 배열 반환
    return JSON.parse(data);
  } catch (err) {
    console.error(`File read error at ${filePath}:`, err);
    return [];
  }
};

// 헬퍼: 파일 쓰기
const writeData = (filePath: string, data: any[]) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// [GET] 모든 게시글 가져오기
export async function GET() {
  try {
    const posts = readData(postsPath);
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

    const posts = readData(postsPath);
    const users = readData(usersPath);
    const body = await request.json();

    // ✅ 클라이언트에서 보낸 authorImage를 구조분해할당으로 받습니다.
    const { title, content, category, author, authorImage, image, rating } =
      body;

    // 현재 작성 유저의 최신 프로필 이미지를 서버 데이터(users.json)에서 한 번 더 확인 (보안 및 정확성)
    const currentUser = users.find((u: any) => u.email === userEmail);
    const finalAuthorImage =
      currentUser?.profileImage || authorImage || "/image/default-profile.png";

    // 2. 새 게시글 객체 생성
    const newPost = {
      postId: Date.now(),
      title,
      content,
      category,
      author, // 닉네임
      authorImage: finalAuthorImage, // ✅ 여기에 프로필 이미지 경로가 저장됩니다.
      authorEmail: userEmail,
      image: image || null,
      rating: category === "캠핑장비 리뷰" ? rating : undefined,
      createdAt: new Date()
        .toLocaleDateString("ko-KR")
        .replace(/\. /g, ".")
        .replace(/\.$/, ""),
      viewCount: 0,
      commentCount: 0,
      likeCount: 0,
    };

    // 3. 게시글 저장
    const updatedPosts = [newPost, ...posts];
    writeData(postsPath, updatedPosts);

    // 4. 유저 활동 데이터 업데이트
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

      users[userIndex].activity.boardCount += 1;

      if (category === "캠핑장비 리뷰") {
        users[userIndex].activity.reviewCount += 1;
      }

      writeData(usersPath, users);
    }

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
