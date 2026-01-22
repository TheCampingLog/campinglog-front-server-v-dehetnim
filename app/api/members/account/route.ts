import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises"; // ✅ 1. 비동기 I/O 모듈로 교체
import path from "path";

const dataPath = path.join(process.cwd(), "data", "users.json");

/**
 * ✅ 1. GET: 로그인한 유저의 프로필 정보 가져오기
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ✅ 2. 비동기식 파일 읽기 (자바의 Async I/O)
    const fileData = await fs.readFile(dataPath, "utf8");
    const users = JSON.parse(fileData);

    const currentUser = users.find((u: any) => u.email === userEmail);
    if (!currentUser)
      return NextResponse.json({ error: "Not Found" }, { status: 404 });

    const { password, ...userWithoutPassword } = currentUser;

    return NextResponse.json(userWithoutPassword, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

/**
 * ✅ 2. PUT: 로그인한 유저의 정보 수정하기
 */
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const fileData = await fs.readFile(dataPath, "utf8"); // ✅ 비동기 처리
    let users = JSON.parse(fileData);

    const userIndex = users.findIndex((u: any) => u.email === userEmail);
    if (userIndex === -1)
      return NextResponse.json({ error: "Not Found" }, { status: 404 });

    // ✅ 3. 필드 화이트리스트 적용 (자바의 DTO 매핑과 유사)
    // body에서 필요한 것만 꺼내서 덮어씁니다.
    const { nickname, profileImage, phoneNumber } = body;

    users[userIndex] = {
      ...users[userIndex],
      nickname: nickname ?? users[userIndex].nickname,
      profileImage: profileImage ?? users[userIndex].profileImage,
      phoneNumber: phoneNumber ?? users[userIndex].phoneNumber,
      email: userEmail, // PK 역할인 이메일은 변조 방지
    };

    // ✅ 4. 비동기 파일 쓰기 및 용량 최적화 (Indent 제거)
    await fs.writeFile(dataPath, JSON.stringify(users), "utf8");

    return NextResponse.json({
      success: true,
      user: {
        nickname: users[userIndex].nickname,
        profileImage: users[userIndex].profileImage,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
  }
}
