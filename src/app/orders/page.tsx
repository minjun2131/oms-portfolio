import { OrderList } from "@/features/orders/components";

export const metadata = {
  title: "주문 관리 | SellerFlow",
  description: "모든 주문을 확인하고 관리하세요.",
};

export default function OrdersPage() {
  return <OrderList />;
}
