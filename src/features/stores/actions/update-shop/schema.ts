import { z } from "zod";

export const updateShopSchema = z.object({
  id: z.string().uuid({ message: "유효하지 않은 상점 ID입니다." }),
  name: z
    .string()
    .min(1, { message: "상점명을 입력해주세요." })
    .max(50, { message: "상점명은 최대 50자까지 가능합니다." }),
});

export type UpdateShopInput = z.infer<typeof updateShopSchema>;
