import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "users.json");

/**
 * ✅ 1. GET: 현재 로그인한 유저 정보 가져오기
 */
export async function GET() {
  try {
    // Next.js 15 필수: cookies() 앞에 await를 붙여야 get()을 쓸 수 있습니다.
    const cookieStore = await cookies();
    const email = cookieStore.get("user_email")?.value;

    if (!email) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const fileData = fs.readFileSync(dataPath, "utf8");
    const users = JSON.parse(fileData);

    // 내 이메일과 일치하는 유저 찾기
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: "유저를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 비밀번호 제외하고 반환
    const { password, ...safeUser } = user;
    return NextResponse.json(safeUser, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json({ error: "정보 로드 실패" }, { status: 500 });
  }
}

/**
 * ✅ 2. PUT: 현재 로그인한 유저 정보 수정하기
 */
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get("user_email")?.value;

    if (!email) {
      return NextResponse.json(
        { error: "수정 권한이 없습니다." },
        { status: 401 }
      );
    }

    const body = await request.json(); // 프론트에서 보낸 수정 데이터 (nickname, profileImage 등)
    const fileData = fs.readFileSync(dataPath, "utf8");
    let users = JSON.parse(fileData);

    // 내 이메일이 위치한 인덱스 찾기
    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: "유저를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // ✅ 기존 유저 데이터에 새로운 데이터를 덮어쓰기 (이메일은 변경 방지)
    users[userIndex] = {
      ...users[userIndex],
      ...body,
      email: email, // 이메일은 절대 변하지 않도록 강제 고정
    };

    // 파일에 저장
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2), "utf8");

    // 수정된 최신 정보 반환 (패스워드 제외)
    const { password, ...updatedUser } = users[userIndex];
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("수정 오류:", error);
    return NextResponse.json({ error: "정보 수정 실패" }, { status: 500 });
  }
}
