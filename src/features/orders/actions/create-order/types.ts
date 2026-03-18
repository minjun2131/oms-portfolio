export interface CreateOrderState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
