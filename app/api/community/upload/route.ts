import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "파일이 없습니다." },
        { status: 400 }
      );
    }

    // 1. 저장 경로 설정 (public/uploads)
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 2. 고유한 파일명 생성 (중복 방지)
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const filePath = path.join(uploadDir, fileName);

    // 3. 파일 저장
    fs.writeFileSync(filePath, buffer);

    // 4. 접근 가능한 URL 반환
    return NextResponse.json({
      success: true,
      url: `/uploads/${fileName}`, // 클라이언트가 접근할 경로
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "업로드 실패" },
      { status: 500 }
    );
  }
}
