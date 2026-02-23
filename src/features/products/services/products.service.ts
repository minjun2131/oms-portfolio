import { buildSearchProductsQuery } from "../query-builder/products.builder";

// 2단계: Builder에서 만든 쿼리를 실행 (await)하고 에러를 처리하는 Service 계층
export const getProducts = async (params?: { category?: string; search?: string }) => {
  try {
    const query = await buildSearchProductsQuery(params);
    const { data, error } = await query;

    if (error) {
      console.error("Products Service Fetch Error:", error.message);
      throw new Error("상품 목록을 가져오는데 실패했습니다.");
    }

    return data;
  } catch (err) {
    console.error("Products Service General Error:", err);
    throw err;
  }
};
