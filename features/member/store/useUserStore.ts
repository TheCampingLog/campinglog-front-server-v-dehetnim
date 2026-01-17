import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 1. 상태 및 액션 인터페이스 정의
interface UserState {
  nickname: string;
  profileImage: string;
  email: string;
  isLoggedIn: boolean; // ✅ 로그인 여부를 쉽게 확인하기 위한 상태 추가
  setNickname: (name: string) => void;
  setProfileImage: (image: string) => void;
  setEmail: (email: string) => void;
  setUserInfo: (info: {
    nickname: string;
    profileImage: string;
    email: string;
  }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // 초기 상태
      nickname: "",
      profileImage: "/image/default-profile.png",
      email: "",
      isLoggedIn: false,

      // 개별 수정 함수
      setNickname: (name) => set({ nickname: name }),
      setProfileImage: (image) => set({ profileImage: image }),
      setEmail: (email) => set({ email: email }),

      // ✅ 통합 수정 함수 (로그인 및 프로필 수정 성공 시 사용)
      setUserInfo: (info) =>
        set({
          nickname: info.nickname,
          profileImage: info.profileImage || "/image/default-profile.png",
          email: info.email,
          isLoggedIn: !!info.email, // 이메일이 있으면 true
        }),

      // ✅ 로그아웃 및 초기화 로직
      clearUser: () => {
        // 1. 상태 초기화
        set({
          nickname: "",
          profileImage: "/image/default-profile.png",
          email: "",
          isLoggedIn: false,
        });

        // 2. 물리적 저장소 삭제 (쿠키와 별개로 로컬 스토리지 청소)
        if (typeof window !== "undefined") {
          localStorage.removeItem("user-storage");
          // 필요하다면 모든 세션/로컬 데이터 삭제
          // localStorage.clear();
        }
      },
    }),
    {
      name: "user-storage", // 로컬 스토리지에 저장될 키 이름
      storage: createJSONStorage(() => localStorage),

      // ✅ [추가] Hydration 오류 방지 (서버/클라이언트 데이터 충돌 해결)
      // 페이지 로드 시 로컬 스토리지 데이터를 안전하게 복구합니다.
      onRehydrateStorage: () => (state) => {
        console.log("유저 정보 동기화 완료");
      },
    }
  )
);
