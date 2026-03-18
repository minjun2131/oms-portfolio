import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getProducts } from "../../services/get-products";
import { productsQueryKeys } from "../../constants/query-keys";
import { ProductFilters } from "../../types";

/**
 * 3단계-1: 상품 목록 조회 (단일 페이지)
 */
export function useProducts(params?: ProductFilters) {
  const supabase = createClient();

  return useQuery({
    queryKey: productsQueryKeys.list(params ?? {}),
    queryFn: () => getProducts(supabase, params),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 3단계-2: 상품 목록 조회 (무한 스크롤 / 페이지네이션)
 */
export function useInfiniteProducts(params?: ProductFilters) {
  const supabase = createClient();

  return useInfiniteQuery({
    queryKey: productsQueryKeys.list({ ...params, type: "infinite" }),
    queryFn: ({ pageParam = 1 }) =>
      getProducts(supabase, {
        ...params,
        page: pageParam as number,
        limit: params?.limit ?? 20,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
