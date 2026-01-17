import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword")?.trim() || "";

  const SERVICE_KEY = decodeURIComponent(
    "b480cc6e33c2a96e615cad6cc8c39b37952a21519a494a5b1ee17846d66496ee"
  );

  // ✅ 3000개 정도를 한 번에 가져와서 서버에서 필터링합니다. (가장 확실한 방법)
  const url = `http://apis.data.go.kr/B551011/GoCamping/basedList?_type=json&MobileOS=ETC&MobileApp=CampingLog&numOfRows=3000&pageNo=1&serviceKey=${SERVICE_KEY}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    let items = data.response?.body?.items?.item || [];
    if (!Array.isArray(items)) items = [items];

    // ✅ 검색어(keyword)가 있을 경우 서버에서 정밀 필터링
    if (keyword && keyword !== "전체") {
      // "전북특별자치도" -> "전북", "강원특별자치도" -> "강원" 등 핵심 키워드만 추출
      const searchKey = keyword.substring(0, 2);

      items = items.filter((item: any) => {
        const addr = item.addr1 || "";
        const doNm = item.doNm || "";
        const name = item.facltNm || "";

        // 주소나 지역명에 '전북', '강원' 등이 포함되어 있는지 확인
        return (
          addr.includes(searchKey) ||
          doNm.includes(searchKey) ||
          name.includes(searchKey)
        );
      });
    }

    console.log(`[${keyword}] 필터링 결과: ${items.length}건`);
    return NextResponse.json(items);
  } catch (error) {
    console.error("서버 에러:", error);
    return NextResponse.json([]);
  }
}
