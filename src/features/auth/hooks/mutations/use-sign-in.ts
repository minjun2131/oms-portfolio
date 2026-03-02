import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { signIn } from "../../services/sign-in";
import { SignInWithPasswordCredentials } from "@supabase/supabase-js";

/**
 * 4단계: 로그인 Mutation 훅
 * 클라이언트 측에서 Browser Client를 통해 서비스를 호출합니다.
 */
export function useSignIn() {
  const supabase = createClient();

  return useMutation({
    mutationFn: (credentials: SignInWithPasswordCredentials) => 
      signIn(supabase, credentials),
    onSuccess: (data) => {
      console.log("Signin success:", data);
    },
    onError: (error: Error) => {
      console.error("Signin error:", error.message);
    },
  });
}
