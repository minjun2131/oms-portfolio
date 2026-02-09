// import { createClient } from "@supabase/supabase-js";
// import type { Database } from "@/types/database.types";

/**
 * 관리자 전용 Supabase 클라이언트 (RLS 우회)
 * 주의: 서버 사이드에서만 사용
 * @supabase/supabase-js 설치 후 활성화
 */

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
//   auth: {
//     autoRefreshToken: false,
//     persistSession: false,
//   },
// });

export {};
