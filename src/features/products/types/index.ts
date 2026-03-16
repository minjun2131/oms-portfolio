/**
 * 상품 UI 타입 정의
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "sold_out" | "hidden";
  sku: string;
  imageUrl: string | null;
  shopName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  category?: string;
  status?: Product["status"];
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * 재고 관리 UI 타입
 * Product에서 재고 관련 필드만 추출하여 재고 관리에 특화된 타입입니다.
 */
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  imageUrl: string | null;
  currentStock: number;
  minStock: number;
}
