import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { getAuthBuilder } from "../query-builder/auth.builder";

/**
 * 2단계: 인증 상태 조회 서비스
 * authBuilder를 사용하여 현재 세션의 유저 정보를 가져옵니다.
 */
export const getAuth = async (supabaseClient: SupabaseClient<Database>) => {
  const auth = getAuthBuilder(supabaseClient);
  const { data: { user }, error } = await auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
};
