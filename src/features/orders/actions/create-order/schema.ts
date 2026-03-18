import { z } from "zod";

export const orderItemSchema = z.object({
  product_id: z.string().uuid("올바른 상품 ID 형식이 아닙니다.").nullable(),
  product_name: z.string().min(1, "상품명은 필수입니다."),
  variant: z.string().nullable().optional(),
  price: z.coerce.number().min(0, "가격은 0 이상이어야 합니다."),
  quantity: z.coerce.number().min(1, "수량은 1개 이상이어야 합니다."),
});

export const createOrderSchema = z.object({
  shop_id: z.string().uuid("올바른 상점 ID 형식이 아닙니다."),
  buyer_id: z.string().uuid("올바른 구매자 ID 형식이 아닙니다.").nullable().optional(),
  customer_name: z.string().min(1, "주문자 이름은 필수입니다."),
  customer_phone: z.string().min(1, "주문자 연락처는 필수입니다."),
  customer_email: z.string().email("올바른 이메일 형식이 아닙니다.").nullable().optional(),
  receiver_name: z.string().min(1, "수령인 이름은 필수입니다."),
  receiver_phone: z.string().min(1, "수령인 연락처는 필수입니다."),
  zipcode: z.string().min(1, "우편번호는 필수입니다."),
  address: z.string().min(1, "주소는 필수입니다."),
  address_detail: z.string().nullable().optional(),
  delivery_memo: z.string().nullable().optional(),
  shipping_cost: z.coerce.number().min(0, "배송비는 0 이상이어야 합니다."),
  subtotal_amount: z.coerce.number().min(0, "상품 총액은 0 이상이어야 합니다."),
  total_amount: z.coerce.number().min(0, "총 결제 금액은 0 이상이어야 합니다."),
  payment_method: z.string().nullable().optional(),
  payment_status: z.string().default("pending"),
  status: z.string().default("preparing"),
  order_memo: z.string().nullable().optional(),
  items: z.array(orderItemSchema).min(1, "최소 1개 이상의 상품을 선택해야 합니다."),
});
