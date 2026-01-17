import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword"); // 검색어 가져오기
  const SERVICE_KEY =
    "b480cc6e33c2a96e615cad6cc8c39b37952a21519a494a5b1ee17846d66496ee";

  // 기본 URL은 전체 목록, 검색어가 있으면 검색 API 사용
  let url = `http://apis.data.go.kr/B551011/GoCamping/basedList?serviceKey=${SERVICE_KEY}&_type=json&MobileOS=ETC&MobileApp=AppTest&numOfRows=20&pageNo=1`;

  if (keyword) {
    // 한글 검색어를 위해 encodeURIComponent 사용
    url = `http://apis.data.go.kr/B551011/GoCamping/searchList?serviceKey=${SERVICE_KEY}&_type=json&MobileOS=ETC&MobileApp=AppTest&numOfRows=20&pageNo=1&keyword=${encodeURIComponent(
      keyword
    )}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    const items = data.response?.body?.items?.item || [];
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "데이터 로딩 실패" }, { status: 500 });
  }
}
