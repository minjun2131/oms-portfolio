import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { getShopsQueryBuilder } from "../query-builder/get-shops.builder";
import { createShopQueryBuilder } from "../query-builder/create-shop.builder";
import { updateShopQueryBuilder } from "../query-builder/update-shop.builder";
import { deleteShopQueryBuilder } from "../query-builder/delete-shop.builder";
import type { Shop } from "../types";

/**
 * DB 레코드(snake_case)를 Shop UI 타입(camelCase)으로 변환합니다.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToShop = (row: any): Shop => ({
  id: row.id,
  name: row.name,
  ownerId: row.owner_id ?? null,
  createdAt: row.created_at ?? null,
  updatedAt: row.updated_at ?? null,
});

/**
 * 상점 목록 조회 서비스
 */
export const getShops = async (
  supabaseClient: SupabaseClient<Database>,
  params?: { search?: string }
): Promise<Shop[]> => {
  const { data, error } = await getShopsQueryBuilder(supabaseClient, params);

  if (error) {
    throw new Error("상점 목록을 불러오는 데 실패했습니다: " + error.message);
  }

  return (data ?? []).map(mapToShop);
};

/**
 * 상점 등록 서비스
 */
export const createShop = async (
  supabaseClient: SupabaseClient<Database>,
  data: Record<string, unknown>
): Promise<Shop> => {
  const { data: shop, error } = await createShopQueryBuilder(supabaseClient, data);

  if (error) {
    throw new Error("상점 등록에 실패했습니다: " + error.message);
  }

  return mapToShop(shop);
};

/**
 * 상점 수정 서비스
 */
export const updateShop = async (
  supabaseClient: SupabaseClient<Database>,
  id: string,
  data: Record<string, unknown>
): Promise<Shop> => {
  const { data: shop, error } = await updateShopQueryBuilder(supabaseClient, id, data);

  if (error) {
    throw new Error("상점 수정에 실패했습니다: " + error.message);
  }

  return mapToShop(shop);
};

/**
 * 상점 삭제 서비스
 */
export const deleteShop = async (
  supabaseClient: SupabaseClient<Database>,
  id: string
): Promise<void> => {
  const { error } = await deleteShopQueryBuilder(supabaseClient, id);

  if (error) {
    throw new Error("상점 삭제에 실패했습니다: " + error.message);
  }
};
