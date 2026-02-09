/**
 * 주문 Mock 데이터
 */

export const mockOrders = [
  {
    id: "ord-1",
    orderNumber: "ORD-2024-0128",
    customerName: "이지은",
    productName: "아크릴 키링 세트",
    price: 32000,
    status: "shipping",
    createdAt: "2024-01-28T14:30:00Z",
  },
  {
    id: "ord-2",
    orderNumber: "ORD-2024-0127",
    customerName: "박민수",
    productName: "포토카드 풀세트",
    price: 45000,
    status: "payment_confirmed",
    createdAt: "2024-01-27T10:15:00Z",
  },
  {
    id: "ord-3",
    orderNumber: "ORD-2024-0126",
    customerName: "김하늘",
    productName: "미니 포스터 3종",
    price: 18000,
    status: "delivered",
    createdAt: "2024-01-26T09:00:00Z",
  },
];
