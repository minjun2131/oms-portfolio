"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, X, Eye, Save } from "lucide-react";
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

export function ProductForm() {
  const [images, setImages] = useState<string[]>([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const handleImageUpload = () => {
    // Simulating image upload
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
            <h1 className="text-2xl font-bold text-foreground">상품 등록</h1>
            <p className="mt-1 text-muted-foreground">
              새로운 굿즈를 등록하고 판매를 시작하세요
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Eye className="h-4 w-4" />
              미리보기
            </Button>
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              상품 등록
            </Button>
          </div>
        </div>
      </div>

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
                  placeholder="예: 아크릴 키링 - 봄날의 토끼"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  고객에게 보여지는 상품 이름입니다
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  상세 설명
                </label>
                <Textarea
                  id="description"
                  placeholder="상품에 대한 상세한 설명을 입력하세요. 재질, 크기, 특징 등을 자세히 작성해주세요."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[160px] resize-none"
                />
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
                      type="number"
                      placeholder="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
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
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    정가 (할인 표시용)
                  </label>
                  <div className="relative">
                    <Input
                      id="comparePrice"
                      type="number"
                      placeholder="0"
                      value={comparePrice}
                      onChange={(e) => setComparePrice(e.target.value)}
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

          {/* Category */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">분류</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  카테고리
                </label>
                <Select>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keyring">키링</SelectItem>
                    <SelectItem value="stationery">문구</SelectItem>
                    <SelectItem value="sticker">스티커</SelectItem>
                    <SelectItem value="fabric">패브릭</SelectItem>
                    <SelectItem value="acrylic">아크릴</SelectItem>
                    <SelectItem value="poster">포스터</SelectItem>
                    <SelectItem value="postcard">엽서</SelectItem>
                  </SelectContent>
                </Select>
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
                  수량
                </label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="h-11"
                />
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
                  placeholder="예: KEYRING-001"
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
    </div>
  );
}
