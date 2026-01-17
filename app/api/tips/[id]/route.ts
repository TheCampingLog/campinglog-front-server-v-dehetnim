import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "tips.json");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ 1. Promise 타입으로 변경
) {
  try {
    // ✅ 2. params를 await로 기다린 후 id 추출
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileData = fs.readFileSync(dataPath, "utf8");

    // ✅ 3. 빈 파일이거나 잘못된 JSON일 경우를 대비한 예외 처리
    let tips = [];
    try {
      tips = fileData ? JSON.parse(fileData) : [];
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 500 }
      );
    }

    // tips.json 안의 객체들 중 id가 일치하는 것을 찾음
    const tip = tips.find((t: any) => Number(t.id) === id);

    if (!tip) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(tip);
  } catch (error) {
    console.error("Fetch Tip Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
