"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, X, Eye, Save, Loader2 } from "lucide-react";
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
      router.push(ROUTES.PRODUCTS);
    }
  }, [state, router]);

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
            <p className="mt-1 text-muted-foreground">
              {isEditMode
                ? "상품 정보를 수정하고 저장하세요"
                : "새로운 굿즈를 등록하고 판매를 시작하세요"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Eye className="h-4 w-4" />
              미리보기
            </Button>
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
                  ? "수정 중..."
                  : "등록 중..."
                : isEditMode
                ? "수정 완료"
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
        <input type="hidden" name="category" value={category} />
        <input type="hidden" name="status" value={String(isPublished)} />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Info */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="productName"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    상품명 <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="productName"
                    name="name"
                    placeholder="예: 아크릴 키링 - 봄날의 토끼"
                    defaultValue={initialData?.name ?? ""}
                    className="h-11"
                  />
                  {getFieldError("name") && (
                    <p className="text-xs text-destructive">{getFieldError("name")}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    고객에게 보여지는 상품 이름입니다
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    상세 설명 <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="상품에 대한 상세한 설명을 입력하세요. 재질, 크기, 특징 등을 자세히 작성해주세요."
                    defaultValue={initialData?.description ?? ""}
                    className="min-h-[160px] resize-none"
                  />
                  {getFieldError("description") && (
                    <p className="text-xs text-destructive">{getFieldError("description")}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    상품 페이지에 표시되는 상세 설명입니다
                  </p>
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
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                          대표
                        </span>
                      )}
                    </div>
                  ))}
                  {images.length < 5 && (
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/50 bg-muted/30 transition-colors hover:border-primary/50 hover:bg-primary/5"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        이미지 추가
                      </span>
                    </button>
                  )}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  최대 5장까지 업로드 가능합니다. 첫 번째 이미지가 대표 이미지로
                  설정됩니다.
                </p>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">가격 설정</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="price"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                    {getFieldError("price") && (
                      <p className="text-xs text-destructive">{getFieldError("price")}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="comparePrice"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      정가 (할인 표시용)
                    </label>
                    <div className="relative">
                      <Input
                        id="comparePrice"
                        type="number"
                        placeholder="0"
                        className="h-11 pr-10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        원
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      정가를 입력하면 할인율이 자동으로 표시됩니다
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Side Info */}
          <div className="space-y-6">
            {/* Status */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">판매 상태</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      즉시 판매
                    </label>
                    <p className="text-xs text-muted-foreground">
                      등록 즉시 고객에게 노출됩니다
                    </p>
                  </div>
                  <Switch
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category and Source */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">분류 및 판매처</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    카테고리 <span className="text-destructive">*</span>
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="키링">키링</SelectItem>
                      <SelectItem value="문구">문구</SelectItem>
                      <SelectItem value="스티커">스티커</SelectItem>
                      <SelectItem value="패브릭">패브릭</SelectItem>
                      <SelectItem value="아크릴">아크릴</SelectItem>
                      <SelectItem value="포스터">포스터</SelectItem>
                      <SelectItem value="엽서">엽서</SelectItem>
                    </SelectContent>
                  </Select>
                  {getFieldError("category") && (
                    <p className="text-xs text-destructive">{getFieldError("category")}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="shopName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    판매처(상점명) <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="shopName"
                    name="shopName"
                    placeholder="예: 쿠팡, 네이버 스마트스토어"
                    defaultValue={initialData?.shops?.name ?? initialData?.shopName ?? ""}
                    className="h-11"
                  />
                  {getFieldError("shopName") && (
                    <p className="text-xs text-destructive">{getFieldError("shopName")}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    입력하신 상점이 없으면 새로 생성됩니다.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    태그
                  </label>
                  <Input placeholder="태그 입력 후 Enter" className="h-11" />
                  <p className="text-xs text-muted-foreground">
                    검색에 도움이 되는 키워드를 입력하세요
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">재고 관리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="stock"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    수량 <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="stock"
                    name="stock_quantity"
                    type="number"
                    placeholder="0"
                    defaultValue={initialData?.stock_quantity ?? ""}
                    className="h-11"
                  />
                  {getFieldError("stock_quantity") && (
                    <p className="text-xs text-destructive">{getFieldError("stock_quantity")}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="sku"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    SKU (재고관리코드)
                  </label>
                  <Input
                    id="sku"
                    name="sku"
                    placeholder="예: KEYRING-001"
                    defaultValue={initialData?.sku ?? ""}
                    className="h-11"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">배송 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    배송비 설정
                  </label>
                  <Select defaultValue="free">
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">무료 배송</SelectItem>
                      <SelectItem value="paid">유료 배송</SelectItem>
                      <SelectItem value="conditional">조건부 무료</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
