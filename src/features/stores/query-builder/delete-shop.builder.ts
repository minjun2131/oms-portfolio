import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

/**
 * 1단계: 상점 삭제 쿼리 빌더
 */
export const deleteShopQueryBuilder = (
  supabaseClient: SupabaseClient<Database>,
  id: string
) => {
  return supabaseClient.from("shops").delete().eq("id", id);
};
