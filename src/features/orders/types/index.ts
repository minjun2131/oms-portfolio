export interface Order {
  id: string;
  shop_id: string;
  buyer_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  receiver_name: string;
  receiver_phone: string;
  zipcode: string;
  address: string;
  address_detail: string | null;
  delivery_memo: string | null;
  shipping_cost: number;
  subtotal_amount: number;
  total_amount: number;
  payment_method: string | null;
  payment_status: string;
  status: string;
  order_memo: string | null;
  carrier: string | null;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  variant: string | null;
  price: number;
  quantity: number;
  created_at: string;
}
