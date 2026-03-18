import { ReportsView } from "@/features/reports/components/reports-view";

export const metadata = {
  title: "매출 / 정산 - 셀러플로우",
  description: "매출 현황과 정산 내역을 확인하세요.",
};

export default function ReportsPage() {
  return <ReportsView />;
}
