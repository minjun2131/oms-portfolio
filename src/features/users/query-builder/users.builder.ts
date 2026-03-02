import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

// 1단계: 유저 프로필 조회 Query Builder
export const buildGetUserQuery = (
  supabaseClient: SupabaseClient<Database>,
  userId: string
) => {
  // profile 데이터를 가져오는 쿼리 정의 (.single()은 단일 행만 가져옵니다)
  return supabaseClient.from("profiles").select("*").eq("id", userId).single();
};
