export interface DeleteOrderState {
  success: boolean;
  message: string;
  errors?: {
    id?: string[];
  };
  data?: any;
}
