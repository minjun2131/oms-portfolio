import { Metadata } from "next";
import { ProductForm } from "@/features/products/components";

export const metadata: Metadata = {
  title: "상품 등록 | OMS 관리자",
  description: "새로운 상품을 등록합니다.",
};

export default function NewProductPage() {
  return <ProductForm />;
}
