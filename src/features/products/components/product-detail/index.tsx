"use client";

import { ArrowLeft, Edit, Store, Package, Tag, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "../../types";

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail = ({ product }: ProductDetailProps) => {
  const images = (product.product_images && product.product_images.length > 0)
    ? product.product_images.map((img) => img.url)
    : [product.image_url].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/products"
            className="mb-2 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            목록으로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            상품 상세 정보
          </h1>
        </div>
        <Link href={`/products/${product.id}/edit`}>
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            수정하기
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">
                상품 명 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  상품명
                </span>
                <p className="text-lg font-semibold">{product.name || "-"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">
                상품 이미지
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square overflow-hidden rounded-xl border border-border/50 bg-muted"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} 이미지 ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex aspect-[4/1] items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/30">
                    <p className="text-sm text-muted-foreground">등록된 이미지가 없습니다.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Shipping */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">
                가격 및 배송 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-10 sm:grid-cols-3">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    판매가
                  </span>
                  <p className="text-xl font-bold text-primary">
                    {product.price?.toLocaleString() || "0"}원
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    정가
                  </span>
                  <p className="text-lg font-medium text-muted-foreground line-through decoration-destructive/30">
                    {product.compare_price
                      ? `${product.compare_price.toLocaleString()}원`
                      : "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    배송비
                  </span>
                  <p className="text-lg font-medium">
                    {product.shipping_fee === 0
                      ? "무료 배송"
                      : `${product.shipping_fee?.toLocaleString() || "0"}원`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Inventory */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">
                판매 및 재고 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  판매처
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Store className="h-4 w-4" />
                  </div>
                  <p className="font-semibold">
                    {product.shops?.name || "기본 상점"}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  재고 수량
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                    <Package className="h-4 w-4" />
                  </div>
                  <p className="text-lg font-bold">
                    {product.stock_quantity?.toLocaleString() || "0"}개
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
          
          <Card className="border-transparent bg-muted/30 shadow-none">
            <CardContent className="p-4 text-[11px] text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>등록일</span>
                <span>{product.created_at ? new Date(product.created_at).toLocaleDateString() : "-"}</span>
              </div>
              <div className="flex justify-between">
                <span>최종 수정일</span>
                <span>{product.updated_at ? new Date(product.updated_at).toLocaleDateString() : "-"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
