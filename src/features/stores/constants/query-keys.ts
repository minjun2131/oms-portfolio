/**
 * 상점 기능 Query Keys
 */
export const shopsQueryKeys = {
  all: ["shops"] as const,
  lists: () => [...shopsQueryKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...shopsQueryKeys.lists(), filters] as const,
  detail: (id: string) => [...shopsQueryKeys.all, "detail", id] as const,
};
