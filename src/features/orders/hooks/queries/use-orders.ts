import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getOrders, GetOrdersParams } from "../../services/get-orders";
import { ordersQueryKeys } from "../../constants/query-keys";

/**
 * 3단계: 주문 목록 조회 Query 훅
 * 클라이언트 측에서 Browser Client를 통해 서비스를 호출합니다.
 */
export function useOrders(params?: GetOrdersParams) {
  const supabase = createClient();

  return useQuery({
    queryKey: ordersQueryKeys.list((params ?? {}) as Record<string, unknown>),
    queryFn: () => getOrders(supabase, params),
    staleTime: 5 * 60 * 1000,
  });
}
