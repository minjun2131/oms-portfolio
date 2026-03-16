import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

/**
 * 상점명으로 등록된 상점의 ID를 찾거나, 없으면 새로 생성하여 ID를 반환합니다.
 */
export const getOrCreateShopByName = async (
  supabaseClient: SupabaseClient<Database>,
  name: string
): Promise<string> => {
  // 1. 이름이 일치하는 상점 검색
  const { data: existingShop, error: searchError } = await supabaseClient
    .from("shops")
    .select("id")
    .eq("name", name)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .single() as any;

  if (existingShop && existingShop.id) {
    return existingShop.id;
  }

  // 검색 에러 중 PGRST116 (0 rows returned)는 정상이므로 무시, 다른 에러는 throw
  if (searchError && searchError.code !== "PGRST116") {
    console.error("Shop search error:", searchError);
  }

  // 2. 일치하는 상점이 없으면 새로 생성
  const { data: { user } } = await supabaseClient.auth.getUser();
  
  const { data: newShop, error: insertError } = await supabaseClient
    .from("shops")
    .insert({
      name: name,
      owner_id: user?.id ?? null,
    } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    .select("id")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .single() as any;

  if (insertError || !newShop) {
    throw new Error("상점 정보를 생성하거나 찾는 중 에러가 발생했습니다.");
  }

  return newShop.id;
};
