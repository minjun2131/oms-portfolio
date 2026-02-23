import { Metadata } from "next";
import { ProductList } from "@/features/products/components";

export const metadata: Metadata = {
  title: "전체 상품 | OMS 관리자",
  description: "등록된 모든 상품을 관리합니다.",
};

export default function ProductsPage() {
  return <ProductList />;
}
