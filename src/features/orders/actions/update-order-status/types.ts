export type UpdateOrderStatusState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};
