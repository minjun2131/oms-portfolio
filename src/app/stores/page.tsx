import { Metadata } from "next";
import { StoreList } from "@/features/stores/components";

export const metadata: Metadata = {
  title: "상점 관리 | OMS 관리자",
  description: "관리 중인 상점 현황을 확인하고 설정합니다.",
};

export default function StoresPage() {
  return <StoreList />;
}
