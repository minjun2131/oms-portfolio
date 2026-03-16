import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/features/products/components";

export const metadata: Metadata = {
  title: "상품 수정 | OMS 관리자",
  description: "상품 정보를 수정합니다.",
};

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  // 서버에서 상품 데이터 조회
  const supabase = await createClient();
  const { data: product, error } = await (supabase.from("products") as any)
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  return <ProductForm mode="edit" initialData={product} />;
}
