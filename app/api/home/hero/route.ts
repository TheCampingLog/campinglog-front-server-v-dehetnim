import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "hero-slides.json");

    // 파일이 없으면 빈 배열 반환
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const slides = JSON.parse(fileContents);

    return NextResponse.json(slides);
  } catch (error) {
    return NextResponse.json(
      { message: "Error loading hero slides" },
      { status: 500 }
    );
  }
}
