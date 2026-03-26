import React from "react";
import { ShoppingCart, Clock, Truck, CheckCircle2 } from "lucide-react";

export type OrderStatus = "paid" | "preparing" | "shipping" | "shipped" | "delivered" | "cancelled" | "pending";

export interface StatusConfig {
  label: string;
  className: string;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  paid: {
    label: "결제완료",
    className: "bg-emerald-100 text-emerald-700", // 녹색계열
  },
  pending: {
    label: "결제 대기",
    className: "bg-amber-100 text-amber-700", // 노란색
  },
  preparing: {
    label: "준비중",
    className: "bg-amber-100 text-amber-700", // 노란색
  },
  shipping: {
    label: "배송중",
    className: "bg-blue-100 text-blue-700", // 파란색계열
  },
  shipped: {
    label: "배송중",
    className: "bg-blue-100 text-blue-700", // 파란색계열
  },
  delivered: {
    label: "배송완료",
    className: "bg-slate-100 text-slate-600", // 회색
  },
  cancelled: {
    label: "취소",
    className: "bg-rose-100 text-rose-700",
  },
};

export const getOrderSummaryCards = (stats: { 
  total: number | string; 
  pending: number | string; 
  shipping: number | string; 
  delivered: number | string; 
}) => [
  {
    label: "전체 주문",
    value: stats.total.toString(),
    icon: React.createElement(ShoppingCart, { className: "h-5 w-5" }),
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "결제 대기",
    value: stats.pending.toString(),
    icon: React.createElement(Clock, { className: "h-5 w-5" }),
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    label: "배송중",
    value: stats.shipping.toString(),
    icon: React.createElement(Truck, { className: "h-5 w-5" }),
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    label: "배송 완료",
    value: stats.delivered.toString(),
    icon: React.createElement(CheckCircle2, { className: "h-5 w-5" }),
    color: "text-slate-500",
    bgColor: "bg-slate-100",
  },
];
