export const ordersQueryKeys = {
  all: ["orders"] as const,
  lists: () => [...ordersQueryKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...ordersQueryKeys.lists(), params] as const,
  details: () => [...ordersQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...ordersQueryKeys.details(), id] as const,
};
