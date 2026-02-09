/**
 * Enum 상수 정의
 */

export const ProductStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SOLD_OUT: "sold_out",
  HIDDEN: "hidden",
} as const;

export type ProductStatusType = (typeof ProductStatus)[keyof typeof ProductStatus];

export const OrderStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const;

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];

export const InventoryStatus = {
  NORMAL: "normal",
  LOW: "low",
  OUT_OF_STOCK: "out_of_stock",
} as const;

export type InventoryStatusType = (typeof InventoryStatus)[keyof typeof InventoryStatus];
