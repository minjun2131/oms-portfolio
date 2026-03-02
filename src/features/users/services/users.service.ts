import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { buildGetUserQuery } from "../query-builder/users.builder";
import type { UserProfile } from "../types";

// 2단계: 유저별 Query 실행 및 에러 핸들링 (Service 계층)
export const getUserProfile = async (
  supabaseClient: SupabaseClient<Database>,
  userId: string
): Promise<UserProfile | null> => {
  try {
    const query = buildGetUserQuery(supabaseClient, userId);
    const { data, error } = await query;

    // 데이터가 없는 경우(PGRST116: JSON object expected, but zero rows returned)
    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("User Profile Fetch Error:", error.message);
      return null;
    }

    return data as UserProfile;
  } catch (err) {
    console.error("User Profile Service General Error:", err);
    return null;
  }
};
