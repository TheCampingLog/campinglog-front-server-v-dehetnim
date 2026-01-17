// types/camping.ts

export interface CampingSite {
  contentId: string; // 캠핑장 고유 번호
  facltNm: string; // 캠핑장 이름
  lineIntro?: string; // 한 줄 소개
  intro?: string; // 상세 소개
  firstImageUrl?: string; // 대표 이미지 주소
  addr1: string; // 주소
  doNm: string;
  sigunguNm: string;
  tel?: string; // 전화번호
  induty?: string; // 업종 (일반야영장, 자동차야영장 등)
  lctCl?: string; // 입지 (산, 강, 해변 등)
  facltDivNm?: string; // 시설 구분 (민간, 지자체 등)
  mangeSttus?: string; // 운영 상태
}
