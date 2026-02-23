import { createClient } from "@/lib/supabase/server";

// 1단계: Supabase Query를 구성하는 Builder
// 여기서는 데이터베이스에서 어떻게 데이터를 가져올지 정의만 합니다. (실제 요청(await)은 서비스 레이어에서 수행)
export const buildSearchProductsQuery = async (params?: { category?: string; search?: string }) => {
  const supabase = await createClient();
  
  let query = supabase.from("products").select("*");

  if (params?.category) {
    query = query.eq("category", params.category);
  }

  if (params?.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  // 최신 등록 순 정렬
  query = query.order("created_at", { ascending: false });

  return query;
};
