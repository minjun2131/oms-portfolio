import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getProducts } from "../../services/get-products";
import { productsQueryKeys } from "../../constants/query-keys";

/**
 * 3단계: 상품 목록 조회 Query 훅
 * 클라이언트 측에서 Browser Client를 통해 서비스를 호출합니다.
 */
export function useProducts(params?: { category?: string; search?: string }) {
  const supabase = createClient();

  return useQuery({
    queryKey: productsQueryKeys.list(params ?? {}),
    queryFn: () => getProducts(supabase, params),
    staleTime: 5 * 60 * 1000, // 5분
  });
}
