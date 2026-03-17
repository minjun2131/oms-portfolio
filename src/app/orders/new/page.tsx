import { OrderCreateForm } from "@/features/orders/components";

export const metadata = {
  title: "주문 등록 | SellerFlow",
  description: "새로운 주문을 등록하세요.",
};

export default function NewOrderPage() {
  return <OrderCreateForm />;
}
