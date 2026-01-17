import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "users.json");

export async function GET() {
  try {
    // 1. 로그인 확인 (Next.js 15 await 필수)
    const cookieStore = await cookies();
    const email = cookieStore.get("user_email")?.value;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. 파일 읽기
    const fileData = fs.readFileSync(dataPath, "utf8");
    const users = JSON.parse(fileData);

    // 3. 해당 유저 찾기
    const user = users.find((u: any) => u.email === email);

    if (!user || !user.rank) {
      // 만약 rank 정보가 없는 유저라면 기본 등급 부여
      const defaultRank = {
        currentRank: "Beginner",
        totalPoints: 0,
        nextRank: "Silver",
        remainPoints: 1000,
        rankImageUrl: "/image/rank-beginner.png",
      };
      return NextResponse.json(defaultRank);
    }

    // 4. 유저의 rank 정보만 반환
    return NextResponse.json(user.rank);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
