import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const postsPath = path.join(process.cwd(), "data", "posts.json");
const commentsPath = path.join(process.cwd(), "data", "comments.json");
const likesPath = path.join(process.cwd(), "data", "likes.json");

const readData = (p: string) =>
  fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : [];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nickname = searchParams.get("nickname")?.toLowerCase();

    if (!nickname)
      return NextResponse.json({ error: "Nickname required" }, { status: 400 });

    const allPosts = readData(postsPath);
    const allComments = readData(commentsPath);
    let allLikes = readData(likesPath); // let으로 선언하여 수정 가능하게 함

    // 1. 실제 존재하는 게시글 ID 목록 (Set으로 만들어 검색 속도 향상)
    const validPostIds = new Set(allPosts.map((p: any) => p.postId));

    // 2. [청소 로직] 실제 존재하는 게시글의 좋아요만 남기기
    const cleanedLikes = allLikes.filter((l: any) =>
      validPostIds.has(Number(l.postId))
    );

    // 3. 만약 유령 데이터가 있었다면 (개수가 다르다면) 파일에 덮어쓰기
    if (allLikes.length !== cleanedLikes.length) {
      fs.writeFileSync(
        likesPath,
        JSON.stringify(cleanedLikes, null, 2),
        "utf8"
      );
      allLikes = cleanedLikes; // 메모리상의 데이터도 업데이트
      console.log(
        `✅ 유령 데이터 ${
          allLikes.length - cleanedLikes.length
        }개를 삭제했습니다.`
      );
    }

    // 4. 활동량 계산 (이제 cleanedLikes 기준으로 계산됨)
    const myPosts = allPosts.filter(
      (p: any) => p.author?.toLowerCase() === nickname
    );

    const activity = {
      posts: myPosts.filter((p: any) => p.category !== "캠핑장비 리뷰").length,
      reviews: myPosts.filter((p: any) => p.category === "캠핑장비 리뷰")
        .length,
      comments: allComments.filter(
        (c: any) => c.author?.toLowerCase() === nickname
      ).length,
      likes: allLikes.filter((l: any) => l.nickname?.toLowerCase() === nickname)
        .length,
    };

    return NextResponse.json(activity);
  } catch (error) {
    return NextResponse.json({ posts: 0, reviews: 0, comments: 0, likes: 0 });
  }
}
