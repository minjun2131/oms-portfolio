"use server";

import { createClient } from "@/lib/supabase/server";
import { signIn } from "../../services/sign-in";
import { signInSchema, SignInInput } from "./schema";
import { SignInActionResponse } from "./types";

/**
 * 3단계: 로그인 서버 액션
 * 서버 측 유효성 검사 및 Supabase Server Client를 통한 서비스 호출
 */
export async function signInAction(input: SignInInput): Promise<SignInActionResponse> {
  try {
    // 1. 유효성 검사
    const validatedFields = signInSchema.safeParse(input);
    
    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.issues[0].message,
      };
    }

    const { email, password } = validatedFields.data;

    // 2. 서버 클라이언트 생성
    const supabase = await createClient();

    // 3. 서비스 호출
    const data = await signIn(supabase, {
      email,
      password,
    });

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "로그인 중 알 수 없는 에러가 발생했습니다.",
    };
  }
}
