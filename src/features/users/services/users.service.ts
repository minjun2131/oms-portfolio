import { buildGetUserQuery } from "../query-builder/users.builder";
import type { UserProfile } from "../types";

// 2단계: 유저별 Query 실행 및 에러 핸들링 (Service 계층)
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const query = buildGetUserQuery(userId);
    const { data, error } = await query;

    if (error) {
      console.error("User Profile Fetch Error:", error.message);
      throw new Error("유저 정보를 가져오는데 실패했습니다.");
    }

    return data as UserProfile;
  } catch (err) {
    console.error("User Profile Service General Error:", err);
    // UI 단에서 에러 처리를 편하게 하기 위해 null을 반환합니다.
    return null;
  }
};
