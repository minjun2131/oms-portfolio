"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  // 로그인 페이지 등 Sidebar/Header가 필요 없는 페이지 목록
  const hideLayoutPaths = ["/login", "/register"];
  const shouldHideLayout = hideLayoutPaths.includes(pathname);

  if (shouldHideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 lg:ml-64">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
