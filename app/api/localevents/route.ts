import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // ✅ 경로 수정: 프로젝트 루트의 data 폴더 내 localevents.json을 읽음
    const filePath = path.join(process.cwd(), "data", "localevents.json");

    // 파일이 있는지 확인 (디버깅용)
    if (!fs.existsSync(filePath)) {
      console.error("❌ 파일을 찾을 수 없음:", filePath);
      return NextResponse.json(
        { error: "Data file not found" },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const allEvents = JSON.parse(fileContent);

    // 카테고리 필터링
    let filteredData = allEvents;
    if (category && category !== "전체") {
      filteredData = allEvents.filter(
        (event: any) => event.category === category
      );
    }

    // 통신 느낌을 주기 위한 짧은 지연
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
