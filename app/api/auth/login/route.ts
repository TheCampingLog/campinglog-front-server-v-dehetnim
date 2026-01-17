import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "users.json");

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { success: false, message: "사용자 데이터가 없습니다." },
        { status: 404 }
      );
    }

    // 파일 읽기 및 파싱 예외 처리
    const fileContent = fs.readFileSync(dataPath, "utf8");
    const users = fileContent ? JSON.parse(fileContent) : [];

    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "이메일 또는 비밀번호가 틀렸습니다." },
        { status: 401 }
      );
    }

    // ✅ 보안 강화: 비밀번호를 제외한 유저 정보만 추출
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword, // 비밀번호 노출 방지
    });

    // 서버 입장권(쿠키) 발급
    response.cookies.set("user_email", user.email, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류" },
      { status: 500 }
    );
  }
}
