import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
  password: z.string().min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다." }),
  options: z.object({
    data: z.record(z.string(), z.any()).optional(),
  }).optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
