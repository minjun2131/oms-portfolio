import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getShops } from "../../services/shops.service";
import { shopsQueryKeys } from "../../constants/query-keys";

/**
 * 3단계: 상점 목록 조회 Query 훅
 * 클라이언트 측에서 Browser Client를 통해 서비스를 호출합니다.
 */
export function useShops(params?: { search?: string }) {
  const supabase = createClient();

  return useQuery({
    queryKey: shopsQueryKeys.list(params ?? {}),
    queryFn: () => getShops(supabase, params),
    staleTime: 5 * 60 * 1000, // 5분
  });
}
