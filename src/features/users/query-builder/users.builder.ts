import { createAdminClient } from "@/lib/supabase/admin";

// 1단계: 유저 프로필 조회 Query Builder
export const buildGetUserQuery = (userId: string) => {
  // 원래는 createClient()를 사용해 현재 로그인된 유저의 권한(RLS) 안에서 가져와야 하지만,
  // 현재 프론트엔드 로그인 기능이 아직 연동되기 전이므로 연습을 위해 RLS를 무시하는 admin client를 임시로 사용합니다.
  const supabase = createAdminClient();
  
  // profile 데이터를 가져오는 쿼리 정의 (.single()은 단일 행만 가져옵니다)
  return supabase.from("profiles").select("*").eq("id", userId).single();
};
