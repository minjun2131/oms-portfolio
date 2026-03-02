import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { getUserProfile } from "./users.service";

/**
 * 유저 ID를 기반으로 프로필 정보를 가져오는 서비스
 * 기존 getUserProfile의 래퍼 또는 명확한 명칭의 서비스로 활용합니다.
 */
export const getUserById = async (
  supabaseClient: SupabaseClient<Database>,
  userId: string
) => {
  return await getUserProfile(supabaseClient, userId);
};
