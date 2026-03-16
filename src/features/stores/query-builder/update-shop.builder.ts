import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

/**
 * 1단계: 상점 수정 쿼리 빌더
 */
export const updateShopQueryBuilder = (
  supabaseClient: SupabaseClient<Database>,
  id: string,
  data: Record<string, unknown>
) => {
  return supabaseClient
    .from("shops")
    .update(data as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    .eq("id", id)
    .select()
    .single();
};
