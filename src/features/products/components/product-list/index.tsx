"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from "@/features/products/types";

import { mockProducts } from "@/features/products/constants/mock-data";

const getStatusBadge = (status: Product["status"]) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-[oklch(0.65_0.18_145)]/10 text-[oklch(0.5_0.15_145)] hover:bg-[oklch(0.65_0.18_145)]/20 border-0">
          판매중
        </Badge>
      );
    case "sold_out":
      return (
        <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-0">
          품절
        </Badge>
      );
    case "hidden":
    case "inactive":
      return (
        <Badge className="bg-muted text-muted-foreground hover:bg-muted border-0">
          숨김
        </Badge>
      );
  }
};

export function ProductList() {
  const [products] = useState<Product[]>(mockProducts);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const toggleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, id]);
    } else {
      setSelectedProducts((prev) => prev.filter((p) => p !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">전체 상품</h1>
          <p className="mt-1 text-muted-foreground">
            등록된 모든 굿즈를 관리하세요
          </p>
        </div>
        <Link href="/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            상품 등록
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="상품명으로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 카테고리</SelectItem>
                  <SelectItem value="keyring">키링</SelectItem>
                  <SelectItem value="stationery">문구</SelectItem>
                  <SelectItem value="sticker">스티커</SelectItem>
                  <SelectItem value="fabric">패브릭</SelectItem>
                  <SelectItem value="acrylic">아크릴</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="active">판매중</SelectItem>
                  <SelectItem value="sold_out">품절</SelectItem>
                  <SelectItem value="hidden">숨김</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">
              총 {products.length}개 상품
            </CardTitle>
            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedProducts.length}개 선택됨
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive bg-transparent"
                >
                  선택 삭제
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="px-4 py-3 text-left">
                    <Checkbox
                      checked={
                        products.length > 0 &&
                        selectedProducts.length === products.length
                      }
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    상품 정보
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    카테고리
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    판매가
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                    재고
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    상태
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border/30 transition-colors hover:bg-muted/20"
                  >
                    <td className="px-4 py-4 w-12">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => toggleSelect(product.id, e.target.checked)}
                      />
                    </td>
                    <td className="px-4 py-4 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-foreground line-clamp-2">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-muted-foreground">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <span className="font-medium text-foreground">
                        {product.price.toLocaleString()}원
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <span
                        className={
                          product.stock <= 10
                            ? "font-medium text-destructive"
                            : "text-muted-foreground"
                        }
                      >
                        {product.stock}개
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2 focus:bg-accent focus:text-accent-foreground cursor-pointer flex items-center">
                            <Eye className="h-4 w-4" />
                            상세 보기
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 focus:bg-accent focus:text-accent-foreground cursor-pointer flex items-center">
                            <Edit2 className="h-4 w-4" />
                            수정하기
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer flex items-center">
                            <Trash2 className="h-4 w-4" />
                            삭제하기
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border/50 px-4 py-4">
            <p className="text-sm text-muted-foreground">
              1-8 / 총 156개 상품
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 bg-transparent"
              >
                2
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 bg-transparent"
              >
                3
              </Button>
              <span className="px-1 text-muted-foreground">...</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 bg-transparent"
              >
                20
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
