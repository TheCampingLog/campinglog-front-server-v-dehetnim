import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 1. 경로 설정 (루트/data/tips.json)
    const filePath = path.join(process.cwd(), "data", "tips.json");

    // 2. 파일 존재 여부 확인
    if (!fs.existsSync(filePath)) {
      console.error("파일을 찾을 수 없습니다:", filePath);
      return NextResponse.json([], { status: 200 }); // 파일 없으면 빈 배열 반환
    }

    // 3. 파일 읽기 및 파싱
    const fileData = fs.readFileSync(filePath, "utf8");
    const tips = JSON.parse(fileData);

    // 4. 배열인지 확인 후 반환
    return NextResponse.json(Array.isArray(tips) ? tips : []);
  } catch (error) {
    console.error("Tips API GET Error:", error);
    return NextResponse.json([], { status: 500 }); // 에러 시 빈 배열 반환
  }
}
