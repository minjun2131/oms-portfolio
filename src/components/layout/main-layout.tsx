import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { LayoutContent } from "./layout-content";
import { createClient } from "@/lib/supabase/server";
import { getAuth } from "@/features/auth/services/get-auth";
import { getUserById } from "@/features/users/services/get-user-by-id";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/url";

interface MainLayoutProps {
  children: React.ReactNode;
}

export async function MainLayout({ children }: MainLayoutProps) {
  const supabase = await createClient();
  const user = await getAuth(supabase);
  
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAuthPage = pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER;

  if (!user && !isAuthPage) {
    redirect(ROUTES.LOGIN);
  }

  const dbProfile = user ? await getUserById(supabase, user.id) : null;
  
  // 데이터베이스 트리거 실행 지연으로 profile이 바로 조회되지 않을 경우 auth user 정보로 대체
  const displayProfile = dbProfile || (user ? {
    email: user.email || "",
    avatar_url: user.user_metadata?.avatar_url || null,
  } : null);

  return (
    <LayoutContent 
      header={<Header />} 
      sidebar={<Sidebar profile={displayProfile} />}
    >
      {children}
    </LayoutContent>
  );
}
