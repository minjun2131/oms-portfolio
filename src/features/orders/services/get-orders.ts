import { SupabaseClient } from "@supabase/supabase-js";
import { buildSearchOrdersQuery } from "../query-builder/get-orders.builder";

/**
 * 2단계: 주문 목록 조회 서비스
 * Builder에서 만든 조인 쿼리를 실행(await)하고 에러를 처리합니다.
 */
export const getOrders = async (
  supabaseClient: SupabaseClient<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  params?: { search?: string; status?: string }
) => {
  const query = buildSearchOrdersQuery(supabaseClient, params);
  const { data, error } = await query;

  if (error) {
    throw new Error("주문 목록을 불러오지 못했습니다: " + error.message);
  }

  return data;
};
