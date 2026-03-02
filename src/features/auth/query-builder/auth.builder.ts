import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * 1단계: Auth 쿼리 빌더
 * Supabase 클라이언트의 auth 객체를 반환합니다.
 */
export const getAuthBuilder = (supabaseClient: SupabaseClient<Database>) => {
  return supabaseClient.auth;
};
