import { z } from "zod";

export const createShopSchema = z.object({
  name: z
    .string()
    .min(1, { message: "상점명을 입력해주세요." })
    .max(50, { message: "상점명은 최대 50자까지 가능합니다." }),
});

export type CreateShopInput = z.infer<typeof createShopSchema>;
