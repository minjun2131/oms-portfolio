export interface ShopActionState {
  success: boolean;
  message: string;
  errors: Record<string, string[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}
