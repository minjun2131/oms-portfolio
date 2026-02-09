/**
 * 상품 기능 Query Keys
 */
export const productsQueryKeys = {
  all: ["products"] as const,
  lists: () => [...productsQueryKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...productsQueryKeys.lists(), filters] as const,
  details: () => [...productsQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...productsQueryKeys.details(), id] as const,
};
