import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "users.json");

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // "email" 또는 "nickname"
  const value = searchParams.get("value");

  if (!type || !value)
    return NextResponse.json(
      { success: false, message: "잘못된 요청" },
      { status: 400 }
    );

  const users = JSON.parse(fs.readFileSync(dataPath, "utf8") || "[]");
  const isDuplicate = users.some((u: any) => u[type] === value);

  if (isDuplicate) {
    return NextResponse.json({
      success: false,
      message: `이미 사용 중인 ${
        type === "email" ? "이메일" : "닉네임"
      }입니다.`,
    });
  }

  return NextResponse.json({
    success: true,
    message: `사용 가능한 ${type === "email" ? "이메일" : "닉네임"}입니다.`,
  });
}
