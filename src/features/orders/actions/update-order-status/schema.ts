import { z } from "zod";

export const updateOrderStatusSchema = z.object({
  status: z.string().optional(),
  payment_status: z.string().optional(),
  order_memo: z.string().nullable().optional(),
  carrier: z.string().nullable().optional(),
  tracking_number: z.string().nullable().optional(),
});
