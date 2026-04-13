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
    const product = await getProductById(supabase, id);

    if (!product) {
      notFound();
    }

    return <ProductDetail product={product} />;


  } catch (error) {
    console.error("Failed to fetch product:", error);
    notFound();
  }
}

