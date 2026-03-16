import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

/**
 * 1단계: 상점 목록 조회 쿼리 빌더
 * Supabase 쿼리를 구성만 하고, 실제 실행(await)은 서비스 레이어에서 수행합니다.
 */
export const getShopsQueryBuilder = (
  supabaseClient: SupabaseClient<Database>,
  params?: { search?: string }
) => {
  let query = supabaseClient
    .from("shops")
    .select("*")
    .order("created_at", { ascending: false });

  if (params?.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  return query;
};
