import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 데이터 파일 경로 설정
const dataPath = path.join(process.cwd(), "data", "tips.json");

export async function POST(
  request: Request,
  // ✅ 1. params 타입을 Promise로 변경
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ 2. params를 사용하기 위해 await 추가
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    // 3. 파일 존재 여부 확인
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { error: "Data file not found" },
        { status: 404 }
      );
    }

    // 4. 기존 데이터 읽기
    const fileData = fs.readFileSync(dataPath, "utf8");
    const tips = JSON.parse(fileData);

    // 5. 해당 ID의 데이터만 viewCount를 1 증가시킴
    const updatedTips = tips.map((tip: any) => {
      if (tip.id === id) {
        return {
          ...tip,
          viewCount: (tip.viewCount || 0) + 1,
        };
      }
      return tip;
    });

    // 6. 변경된 데이터를 다시 파일에 저장
    fs.writeFileSync(dataPath, JSON.stringify(updatedTips, null, 2), "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("View Count Update Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
