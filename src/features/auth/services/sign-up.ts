import { SupabaseClient, SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { getAuthBuilder } from "../query-builder/auth.builder";

/**
 * 2단계: 회원가입 서비스
 * authBuilder를 사용하여 signUp 메서드를 호출하고 에러를 핸들링합니다.
 */
export const signUp = async (
  supabaseClient: SupabaseClient<Database>,
  credentials: SignUpWithPasswordCredentials
) => {
  const auth = getAuthBuilder(supabaseClient);
  const { data, error } = await auth.signUp(credentials);

  if (error) {
    throw new Error("회원가입에 실패했습니다: " + error.message);
  }

  return data;
};
