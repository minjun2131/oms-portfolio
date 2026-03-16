import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getProductById } from "../../services/get-product-by-id";
import { productsQueryKeys } from "../../constants/query-keys";

/**
 * 3단계: 단일 상품 조회 Query 훅
 * 클라이언트 측에서 Browser Client를 통해 서비스를 호출합니다.
 */
export function useProductById(productId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: productsQueryKeys.detail(productId),
    queryFn: () => getProductById(supabase, productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5분
  });
}
