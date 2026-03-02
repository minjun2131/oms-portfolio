import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { signUp } from "../../services/sign-up";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";

/**
 * 4단계: 회원가입 Mutation 훅
 * 클라이언트 측에서 Browser Client를 통해 서비스를 호출합니다.
 */
export function useSignUp() {
  const supabase = createClient();

  return useMutation({
    mutationFn: (credentials: SignUpWithPasswordCredentials) => 
      signUp(supabase, credentials),
    onSuccess: (data) => {
      console.log("Signup success:", data);
    },
    onError: (error: Error) => {
      console.error("Signup error:", error.message);
    },
  });
}
