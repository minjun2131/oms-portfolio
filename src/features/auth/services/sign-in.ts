import { SupabaseClient, SignInWithPasswordCredentials } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { getAuthBuilder } from "../query-builder/auth.builder";

/**
 * 2단계: 로그인 서비스
 * authBuilder를 사용하여 signInWithPassword 메서드를 호출하고 에러를 핸들링합니다.
 */
export const signIn = async (
  supabaseClient: SupabaseClient<Database>,
  credentials: SignInWithPasswordCredentials
) => {
  const auth = getAuthBuilder(supabaseClient);
  const { data, error } = await auth.signInWithPassword(credentials);

  if (error) {
    throw new Error("로그인에 실패했습니다: " + error.message);
  }

  return data;
};
