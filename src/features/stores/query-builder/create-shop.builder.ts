import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

/**
 * 1단계: 상점 등록 쿼리 빌더
 */
export const createShopQueryBuilder = (
  supabaseClient: SupabaseClient<Database>,
  data: Record<string, unknown>
) => {
  return supabaseClient
    .from("shops")
    .insert(data as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    .select()
    .single();
};
