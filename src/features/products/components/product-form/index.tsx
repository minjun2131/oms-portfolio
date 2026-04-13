"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, X, Eye, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createProductAction } from "../../actions/create-product";
import { updateProductAction } from "../../actions/update-product";
import type { CreateProductState } from "../../actions/create-product/types";
import type { UpdateProductState } from "../../actions/update-product/types";
import { ROUTES } from "@/constants/url";

/**
 * ProductForm Props
 * mode가 "edit"이면 initialData가 필수입니다.
 */
interface ProductFormProps {
  mode?: "create" | "edit";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: Record<string, any>;
}

type FormState = CreateProductState | UpdateProductState | null;

export function ProductForm({ mode = "create", initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";

  const action = isEditMode ? updateProductAction : createProductAction;
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    action,
    null
  );

  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [isPublished, setIsPublished] = useState(
    initialData ? initialData.status !== "hidden" : true
  );

  // 성공 시 상품 목록으로 이동
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || (isEditMode ? "상품이 수정되었습니다." : "상품이 등록되었습니다."));
      router.push(ROUTES.PRODUCTS);
    } else if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, router, isEditMode]);

  const handleImageUpload = () => {
    const newImage = `/placeholder.svg?height=200&width=200&text=이미지${
      images.length + 1
    }`;
    if (images.length < 5) {
      setImages([...images, newImage]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // 필드별 에러 메시지 헬퍼
  const getFieldError = (field: string): string | undefined => {
    if (state && !state.success && state.errors[field]) {
      return state.errors[field][0];
    }
    return undefined;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <Link
          href="/products"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          전체 상품으로 돌아가기
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEditMode ? "상품 수정" : "상품 등록"}
            </h1>
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              form="product-form"
              className="gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isPending
                ? isEditMode
                  ? "저장 중..."
                  : "등록 중..."
                : isEditMode
                ? "저장 완료"
                : "상품 등록"}
            </Button>
          </div>
        </div>
      </div>

      {/* 전체 에러 메시지 */}
      {state && !state.success && state.message && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.message}
        </div>
      )}

      {/* 성공 메시지 */}
      {state?.success && state.message && (
        <div className="rounded-lg border border-[oklch(0.65_0.18_145)]/50 bg-[oklch(0.65_0.18_145)]/10 px-4 py-3 text-sm text-[oklch(0.5_0.15_145)]">
          {state.message}
        </div>
      )}

      <form id="product-form" action={formAction}>
        {/* hidden fields */}
        {isEditMode && initialData?.id && (
          <input type="hidden" name="id" value={initialData.id} />
        )}
        <input type="hidden" name="images" value={JSON.stringify(images)} />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Info */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">상품 명 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="productName"
                    className="text-sm font-medium leading-none"
                  >
                    상품명 <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="productName"
                    name="name"
                    placeholder="상품 이름을 입력하세요"
                    defaultValue={initialData?.name ?? ""}
                    className="h-11"
                  />
                  {getFieldError("name") && (
                    <p className="text-xs text-destructive">{getFieldError("name")}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">상품 이미지</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-border/50 bg-muted"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`상품 이미지 ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/80 text-background opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/50 bg-muted/30 transition-colors hover:border-primary/50 hover:bg-primary/5"
                    >
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        이미지 추가
                      </span>
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">가격 및 배송 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label
                      htmlFor="price"
                      className="text-sm font-medium leading-none"
                    >
                      판매가 <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        placeholder="0"
                        defaultValue={initialData?.price ?? ""}
                        className="h-11 pr-10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        원
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="comparePrice"
                      className="text-sm font-medium leading-none"
                    >
                      정가
                    </label>
                    <div className="relative">
                      <Input
                        id="comparePrice"
                        name="compare_price"
                        type="number"
                        placeholder="0"
                        defaultValue={initialData?.compare_price ?? ""}
                        className="h-11 pr-10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        원
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="shipping_fee" className="text-sm font-medium leading-none">
                      배송비
                    </label>
                    <div className="relative">
                      <Input
                        id="shipping_fee"
                        name="shipping_fee"
                        type="number"
                        placeholder="0"
                        defaultValue={initialData?.shipping_fee ?? "0"}
                        className="h-11 pr-10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        원
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Side Info */}
          <div className="space-y-6">
            {/* Source */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">판매 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="shopName" className="text-sm font-medium leading-none">
                    판매처 <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="shopName"
                    name="shopName"
                    placeholder="상점명 입력"
                    defaultValue={initialData?.shops?.name ?? initialData?.shopName ?? ""}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="stock"
                    className="text-sm font-medium leading-none"
                  >
                    재고 수량 <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="stock"
                    name="stock_quantity"
                    type="number"
                    placeholder="0"
                    defaultValue={initialData?.stock_quantity ?? ""}
                    className="h-11"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
