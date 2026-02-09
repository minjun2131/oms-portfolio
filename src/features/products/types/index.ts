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
