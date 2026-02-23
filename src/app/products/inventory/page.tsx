import { Metadata } from "next";
import { InventoryList } from "@/features/products/components";

export const metadata: Metadata = {
  title: "재고 관리 | OMS 관리자",
  description: "상품의 재고를 관리합니다.",
};

export default function InventoryPage() {
  return <InventoryList />;
}
