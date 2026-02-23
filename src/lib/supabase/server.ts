import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

// App Router의 서버 컴포넌트, 서버 액션, API 라우트에서 사용 (await cookies() 필요할 수 있음 - Next.js 15+ 대응)
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component 실행 중에 setAll이 불리면 무시 (Server Action이나 Route Handler에서만 쿠키 세팅 가능)
          }
        },
      },
    }
  );
}
