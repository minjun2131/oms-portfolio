import { z } from "zod";

export const updateProductSchema = z.object({
  id: z
    .string()
    .uuid({ message: "유효하지 않은 상품 ID입니다." }),
  name: z
    .string()
    .min(2, { message: "상품명은 최소 2자 이상이어야 합니다." })
    .max(100, { message: "상품명은 최대 100자까지 가능합니다." }),
  price: z.coerce
    .number({ message: "가격은 숫자로 입력해야 합니다." })
    .min(0, { message: "가격은 0 이상이어야 합니다." }),
  stock_quantity: z.coerce
    .number({ message: "수량은 숫자로 입력해야 합니다." })
    .int({ message: "수량은 정수로 입력해야 합니다." })
    .min(0, { message: "수량은 0 이상이어야 합니다." }),
  shopName: z
    .string()
    .min(1, { message: "판매처(상점명)을 입력해주세요." })
    .max(50, { message: "상점명은 50자 이내로 입력해주세요." }),
  compare_price: z.coerce
    .number()
    .min(0, { message: "정가는 0 이상이어야 합니다." })
    .optional()
    .nullable(),
  shipping_fee: z.coerce
    .number()
    .min(0, { message: "배송비는 0 이상이어야 합니다." })
    .default(0),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
