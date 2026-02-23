import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { LayoutContent } from "./layout-content";

interface MainLayoutProps {
  children: React.ReactNode;
}

// 이 컴포넌트는 서버 컴포넌트가 되어 async Header를 정상적으로 렌더링할 수 있습니다.
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <LayoutContent 
      header={<Header />} 
      sidebar={<Sidebar />}
    >
      {children}
    </LayoutContent>
  );
}
