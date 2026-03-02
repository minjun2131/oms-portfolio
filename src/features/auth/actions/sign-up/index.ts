"use server";

import { createClient } from "@/lib/supabase/server";
import { signUp } from "../../services/sign-up";
import { signUpSchema, SignUpInput } from "./schema";
import { SignUpActionResponse } from "./types";

/**
 * 3단계: 회원가입 서버 액션
 * 서버 측 유효성 검사 및 Supabase Server Client를 통한 서비스 호출
 */
export async function signUpAction(input: SignUpInput): Promise<SignUpActionResponse> {
  try {
    // 1. 유효성 검사
    const validatedFields = signUpSchema.safeParse(input);
    
    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.issues[0].message,
      };
    }

    const { email, password, options } = validatedFields.data;

    // 2. 서버 클라이언트 생성
    const supabase = await createClient();

    // 3. 서비스 호출
    const data = await signUp(supabase, {
      email,
      password,
      options,
    });

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "회원가입 중 알 수 없는 에러가 발생했습니다.",
    };
  }
}
