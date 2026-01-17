// 게시글 타입 정의
export interface ResponseGetMemberBoards {
  boardId: number;
  title: string;
  category: string;
  createdAt: string;
  viewCount: number;
  commentCount: number;
}

// 리뷰 타입 정의
export interface ResponseGetMemberReviews {
  reviewId: number;
  productName: string;
  content: string;
  rating: number;
  createdAt: string;
}

// 댓글 타입 정의 (추가됨)
export interface ResponseGetMemberComments {
  commentId: number;
  boardId: number; // 어떤 게시글에 쓴 댓글인지 구분
  boardTitle: string; // 화면에 게시글 제목을 보여주기 위함
  content: string;
  createdAt: string;
}

export interface Member {
  nickname: string;
  email: string;
  memberGrade: string;
  profileImage?: string;
  // 아래 항목을 추가하세요 ✅
  phoneNumber?: string; // 아직 번호가 없는 회원이 있을 수 있다면 ?를 붙입니다.
}
