import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // 파일명을 localevents.json으로 수정
    const filePath = path.join(process.cwd(), "data", "localevents.json");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const events = JSON.parse(fileContents);

    return NextResponse.json(events);
  } catch (error) {
    console.error("Local Events API Error:", error);
    return NextResponse.json(
      { message: "Error loading events" },
      { status: 500 }
    );
  }
}
