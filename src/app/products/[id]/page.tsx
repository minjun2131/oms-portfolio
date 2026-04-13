import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductDetail } from "@/features/products/components";
import { getProductById } from "@/features/products/services/get-product-by-id";
import { Product } from "@/features/products/types";

export const metadata: Metadata = {
  title: "상품 상세 정보 | OMS 관리자",
  description: "상품의 상세 정보를 확인합니다.",
};

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  // 서버에서 상품 데이터 조회 (이미지 포함)
  const supabase = await createClient();
  
  try {
    const raw = await getProductById(supabase as any, id) as any;
    
    if (!raw) {
      notFound();
    }

    // DB 레코드(snake_case)를 UI 타입(Product, camelCase)으로 매핑
    const product: Product = {
      ...raw,
      comparePrice: raw.compare_price ?? null,
      stock: raw.stock_quantity ?? 0,
      imageUrl: raw.image_url,
      images: raw.product_images?.map((img: any) => ({
        id: img.id,
        url: img.url,
        orderIndex: img.order_index
      })) || [],
      shopName: raw.shops?.name,
      shippingFee: raw.shipping_fee ?? 0,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };

    return <ProductDetail product={product} />;

  } catch (error) {
    console.error("Failed to fetch product:", error);
    notFound();
  }
}

