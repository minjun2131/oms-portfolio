"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface LayoutContentProps {
  children: React.ReactNode;
  header: React.ReactNode;
  sidebar: React.ReactNode;
}

export function LayoutContent({ children, header, sidebar }: LayoutContentProps) {
  const pathname = usePathname();
  const hideLayoutPaths = ["/login", "/register"];
  const shouldHideLayout = hideLayoutPaths.includes(pathname);

  if (shouldHideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased flex">
      {sidebar}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 lg:ml-64">
        {header}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
