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

  const profile = user ? await getUserById(supabase, user.id) : null;

  return (
    <LayoutContent 
      header={<Header />} 
      sidebar={<Sidebar profile={profile} />}
    >
      {children}
    </LayoutContent>
  );
}
