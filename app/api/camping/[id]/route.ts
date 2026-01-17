import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const SERVICE_KEY =
    "b480cc6e33c2a96e615cad6cc8c39b37952a21519a494a5b1ee17846d66496ee";

  // ✅ 해결책: 4000개를 다 가져오지 않고, cache 설정을 끕니다.
  // 9MB 데이터를 캐싱하려다 생기는 에러를 방지합니다.
  const url = `http://apis.data.go.kr/B551011/GoCamping/basedList?serviceKey=${SERVICE_KEY}&_type=json&MobileOS=ETC&MobileApp=AppTest&numOfRows=4000&pageNo=1`;

  try {
    // cache: "no-store"를 넣으면 2MB 캐시 제한 에러가 사라집니다.
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    const items = data.response?.body?.items?.item || [];

    const item = items.find(
      (site: any) => String(site.contentId) === String(id)
    );

    if (!item) {
      return NextResponse.json(
        { error: "해당 캠핑장을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("상세 페이지 API 에러:", error);
    return NextResponse.json({ error: "서버 통신 실패" }, { status: 500 });
  }
}
