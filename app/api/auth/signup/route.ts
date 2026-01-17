import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "users.json");

export async function POST(req: Request) {
  try {
    const { email, password, nickname } = await req.json();

    const dirPath = path.dirname(dataPath);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, "[]", "utf8");

    const fileData = fs.readFileSync(dataPath, "utf8");
    const users = fileData ? JSON.parse(fileData) : []; // 빈 파일 대응

    // 1. 중복 체크 (이메일 & 닉네임)
    if (users.find((u: any) => u.email === email)) {
      return NextResponse.json(
        { success: false, message: "이미 사용 중인 이메일입니다." },
        { status: 400 }
      );
    }
    if (users.find((u: any) => u.nickname === nickname)) {
      return NextResponse.json(
        { success: false, message: "이미 사용 중인 닉네임입니다." },
        { status: 400 }
      );
    }

    // 2. 신규 유저 생성
    const newUser = {
      email,
      password, // 실 서비스 시에는 암호화 권장
      nickname,
      profileImage: "/image/default-profile.png",
      phoneNumber: "",
      joinDate: new Date().toISOString().split("T")[0],
      memberGrade: "Beginner",
      rank: {
        currentRank: "Beginner",
        totalPoints: 0,
        nextRank: "Silver",
        remainPoints: 1000,
        rankImageUrl: "/image/rank-beginner.png",
      },
      activity: {
        boardCount: 0,
        commentCount: 0,
        reviewCount: 0,
        likeCount: 0,
      },
    };

    users.push(newUser);
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      message: "Welcome to Camp Vibe!",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
