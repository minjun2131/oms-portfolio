import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { getProductsQueryBuilder } from "../query-builder/get-products.builder";
import type { Product, ProductFilters } from "../types";

export interface GetProductsResult {
  data: Product[];
  count: number | null;
  hasNextPage: boolean;
  nextPage: number | null;
}

/**
 * DB 레코드(snake_case)를 Product UI 타입(camelCase)으로 변환합니다.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  category: row.category,
  price: row.price,
  stock: row.stock ?? 0,
  status: row.status,
  sku: row.sku,
  imageUrl: row.image_url ?? null,
  shopName: row.shops?.name,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

/**
 * 2단계: 상품 목록 조회 서비스
 * Builder에서 만든 쿼리를 실행(await)하고 에러를 처리합니다.
 */
export const getProducts = async (
  supabaseClient: SupabaseClient<Database>,
  params?: ProductFilters
): Promise<GetProductsResult> => {
  const { data, error, count } = await getProductsQueryBuilder(supabaseClient, params);

  if (error) {
    throw new Error("상품 목록을 불러오는 데 실패했습니다: " + error.message);
  }

  const products = (data ?? []).map(mapToProduct);
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const hasNextPage = count ? page * limit < count : false;

  return {
    data: products,
    count,
    hasNextPage,
    nextPage: hasNextPage ? page + 1 : null,
  };
};
