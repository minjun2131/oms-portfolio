import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getOrderById } from "../../services/get-order-by-id";
import { ordersQueryKeys } from "../../constants/query-keys";

/**
 * 4단계: 주문 상세 조회 훅
 */
export function useOrder(orderId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ordersQueryKeys.detail(orderId),
    queryFn: () => getOrderById(supabase, orderId),
    enabled: !!orderId,
  });
}
