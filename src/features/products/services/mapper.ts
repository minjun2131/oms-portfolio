import { Product } from "../types";

/**
 * DB 레코드(snake_case)를 Product UI 타입(camelCase)으로 변수명과 형식을 변환합니다.
 */
export const mapToProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  description: row.description || null,
  category: row.category,
  price: row.price,
  comparePrice: row.compare_price || null,
  stock: row.stock_quantity ?? 0,
  status: row.status,
  sku: row.sku,
  imageUrl: row.image_url ?? null,
  images: row.product_images?.map((img: any) => ({
    id: img.id,
    url: img.url,
    orderIndex: img.order_index
  })) || [],
  shopName: row.shops?.name,
  shippingFee: row.shipping_fee ?? 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
