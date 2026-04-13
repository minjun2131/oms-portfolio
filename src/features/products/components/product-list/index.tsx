"use client";

import { useState, useTransition } from "react";
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
  RefreshCw,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";
import type { Product } from "@/features/products/types";
import type { GetProductsResult } from "@/features/products/services/get-products";

const STATUS_MAP: Record<string, string> = {
  all: "전체 상태",
  active: "판매중",
  sold_out: "품절",
  hidden: "숨김",
};

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useProducts } from "@/features/products/hooks/queries/use-products";
import { deleteProductAction } from "@/features/products/actions/delete-product";
import { useQueryClient } from "@tanstack/react-query";
import { productsQueryKeys } from "@/features/products/constants/query-keys";
import { useEffect, useCallback, useMemo } from "react";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL에서 상태 가져오기
  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("q") || "";
  const statusFilter = (searchParams.get("status") as Product["status"] | "all") || "all";

  // 검색 입력을 위한 로컬 상태 (디바운스용)
  const [inputValue, setInputValue] = useState(searchQuery);

  // 필터 파라미터 메모이제이션 (참조 주소 고정으로 무한 요청 방지)
  const queryParams = useMemo(() => ({
    search: searchQuery, 
    status: statusFilter,
    page: currentPage,
    limit: 10 
  }), [searchQuery, statusFilter, currentPage]);

  const { data: result, isLoading } = useProducts(queryParams);

  const products = result?.data ?? [];
  const totalCount = result?.count ?? 0;
  const totalPages = Math.ceil(totalCount / 10);

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  // URL 업데이트 헬퍼 함수
  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "all" || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      return newParams.toString();
    },
    [searchParams]
  );

  const updateFilters = (newFilters: Record<string, string | number | null>) => {
    // 필터 변경 시 페이지는 1로 리셋 (단, 페이지 자체를 넘기는 경우는 제외)
    const params = { ...newFilters };
    if (!params.page && currentPage !== 1) {
      params.page = 1;
    }
    
    router.push(`${pathname}?${createQueryString(params)}`);
  };

  // 검색어 디바운스 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        updateFilters({ q: inputValue, page: 1 });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, searchQuery]);

  // 외부(URL)에서 검색어가 바뀌면 입력창 동기화
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleDelete = (productId: string, productName: string) => {
    if (!confirm(`"${productName}" 상품을 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteProductAction(productId);
      if (result.success) {
        toast.success(`"${productName}" 상품이 삭제되었습니다.`);
        queryClient.invalidateQueries({ queryKey: productsQueryKeys.all });
        setSelectedProducts((prev) => prev.filter((id) => id !== productId));
      } else {
        toast.error(result.message || "상품 삭제 중 오류가 발생했습니다.");
      }
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((p: Product) => p.id));
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
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={(v) => updateFilters({ status: v })}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="상태">
                    {STATUS_MAP[statusFilter] || statusFilter}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="active">판매중</SelectItem>
                  <SelectItem value="sold_out">품절</SelectItem>
                  <SelectItem value="hidden">숨김</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => {
                setInputValue("");
                updateFilters({ q: "", status: "all", page: 1 });
              }}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Search/Filter effect to reset page */}
      {/* Actually I should reset to page 1 when filters change */}
      {/* I'll add that logic in the component body later if needed, but for now focus on UI */}

      {/* Products Table */}
      {isLoading ? (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">상품 목록을 불러오는 중...</p>
          </CardContent>
        </Card>
      ) : (
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">
              총 {totalCount}개 상품
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
                    판매처 / 카테고리
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
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://via.placeholder.com/150D?text=No+Image";
                              }}
                            />
                          ) : (
                            <span>No Image</span>
                          )}
                        </div>
                        <span className="font-medium text-foreground line-clamp-2">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-foreground">
                          {product.shopName || "-"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {product.category}
                        </span>
                      </div>
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
                          <Link href={`/products/${product.id}`}>
                            <DropdownMenuItem className="gap-2 focus:bg-accent focus:text-accent-foreground cursor-pointer flex items-center">
                              <Eye className="h-4 w-4" />
                              상세 보기
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/products/${product.id}/edit`}>
                            <DropdownMenuItem className="gap-2 focus:bg-accent focus:text-accent-foreground cursor-pointer flex items-center">
                              <Edit2 className="h-4 w-4" />
                              수정하기
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            className="gap-2 text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer flex items-center"
                            onClick={() => handleDelete(product.id, product.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                            {isPending ? "삭제 중..." : "삭제하기"}
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
          <div className="flex items-center justify-center border-t border-border/50 px-4 py-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-transparent hover:bg-primary/10 hover:text-primary border-border/50 transition-colors"
                onClick={() => updateFilters({ page: Math.max(1, currentPage - 1) })}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Generate page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                const isSelected = currentPage === pageNum;
                return (
                  <Button
                    key={pageNum}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-9 w-9 transition-all duration-200",
                      isSelected 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-sm" 
                        : "bg-transparent hover:bg-primary/10 hover:text-primary border-border/50"
                    )}
                    onClick={() => updateFilters({ page: pageNum })}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              {totalPages > 5 && <span className="px-2 text-muted-foreground">...</span>}
              
              {totalPages > 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-9 w-9 transition-all duration-200",
                    currentPage === totalPages 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-sm" 
                      : "bg-transparent hover:bg-primary/10 hover:text-primary border-border/50"
                  )}
                  onClick={() => updateFilters({ page: totalPages })}
                >
                  {totalPages}
                </Button>
              )}

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-transparent hover:bg-primary/10 hover:text-primary border-border/50 transition-colors"
                onClick={() => updateFilters({ page: Math.min(totalPages, currentPage + 1) })}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
