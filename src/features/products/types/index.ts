/**
 * 상품 UI 타입 정의
 */

export interface ProductImage {
  id: string;
  url: string;
  orderIndex: number;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  status: "active" | "inactive" | "sold_out" | "hidden";
  sku: string;
  imageUrl: string | null;
  images?: ProductImage[];
  tags?: string[];
  shippingFee?: number;
  shopName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  category?: string | "all";
  status?: Product["status"] | "all";
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * 재고 관리 UI 타입
 */
export interface InventoryItem extends Omit<Product, "status" | "price" | "stock"> {
  currentStock: number;
  minStock: number;
}

