import type { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "셀러플로우 - 인디 판매자를 위한 스마트한 굿즈 관리",
  description: "재고 관리부터 주문 처리까지, 셀러플로우와 함께 더 쉽고 빠르게 비즈니스를 운영하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
