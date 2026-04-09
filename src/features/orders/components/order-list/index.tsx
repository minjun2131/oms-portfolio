"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Truck,
  ArrowUpDown,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useOrders } from "../../hooks/queries/use-orders";
import {
  ORDER_STATUS_CONFIG,
  getOrderSummaryCards,
  OrderStatus,
} from "../../constants/order-status";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ORDERS_PAGE_SIZE } from "../../services/get-orders";

const getProductSummary = (items: any[]) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!items || items.length === 0) return "상품 없음";
  const firstItem = items[0];
  if (items.length === 1) return firstItem.product_name;
  return `${firstItem.product_name} 외 ${items.length - 1}건`;
};

const getMethodLabel = (method: string | null) => {
  if (!method) return "-";
  const labels: Record<string, string> = {
    card: "신용카드",
    transfer: "계좌이체",
    phone: "휴대폰",
    cash: "현금",
    kakaopay: "카카오페이",
    naverpay: "네이버페이",
  };
  return labels[method] || method;
};

export function OrderList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL에서 상태 읽기
  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("q") || "";
  const statusFilter = searchParams.get("status") || "all";

  // 검색 입력을 위한 로컬 상태 (디바운스용)
  const [inputValue, setInputValue] = useState(searchQuery);

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

  const updateFilters = useCallback(
    (newFilters: Record<string, string | number | null>) => {
      const params = { ...newFilters };
      // 필터 변경 시 페이지는 1로 리셋 (단, 페이지 자체를 넘기는 경우는 제외)
      if (!("page" in params) && currentPage !== 1) {
        params.page = 1;
      }
      router.push(`${pathname}?${createQueryString(params)}`);
    },
    [router, pathname, createQueryString, currentPage]
  );

  // 검색어 디바운스 처리 (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        updateFilters({ q: inputValue, page: 1 });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // 외부(URL)에서 검색어가 바뀌면 입력창 동기화
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // 필터링된 주문 목록 (페이지네이션 포함)
  const { data: result, isLoading } = useOrders({
    search: searchQuery,
    status: statusFilter,
    page: currentPage,
  });

  const orders = result?.data ?? [];
  const totalCount = result?.count ?? 0;
  const totalPages = Math.ceil(totalCount / ORDERS_PAGE_SIZE);

  // 전체 통계용 (필터 없이)
  const { data: allResult } = useOrders();
  const allOrders = allResult?.data ?? [];

  const summaryCards = useMemo(() => {
    const total = allOrders.length;
    const pending = allOrders.filter(
      (o: any) => o.status === "pending" || o.status === "paid" // eslint-disable-line @typescript-eslint/no-explicit-any
    ).length;
    const shipping = allOrders.filter(
      (o: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
        o.status === "shipping" ||
        o.status === "shipped" ||
        o.status === "preparing"
    ).length;
    const delivered = allOrders.filter(
      (o: any) => o.status === "delivered" // eslint-disable-line @typescript-eslint/no-explicit-any
    ).length;

    return getOrderSummaryCards({ total, pending, shipping, delivered });
  }, [allOrders]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">주문 관리</h1>
          <p className="mt-1 text-muted-foreground">
            모든 주문을 확인하고 관리하세요
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            내보내기
          </Button>
          <Link href="/orders/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              주문 등록
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="border-border/50 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  card.bgColor,
                  card.color
                )}
              >
                {card.icon}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-xl font-bold text-foreground">
                  {card.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* 검색 인풋 (디바운스 + URL 연동) */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="주문번호, 고객명, 상품명으로 검색..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="h-10 pl-10"
              />
            </div>
            <div className="flex gap-2">
              {/* 상태 필터 (URL 연동) */}
              <Select
                value={statusFilter}
                onValueChange={(v) => updateFilters({ status: v })}
              >
                <SelectTrigger className="h-10 w-32">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="paid">결제완료</SelectItem>
                  <SelectItem value="preparing">준비중</SelectItem>
                  <SelectItem value="shipping">배송중</SelectItem>
                  <SelectItem value="delivered">배송완료</SelectItem>
                  <SelectItem value="cancelled">취소</SelectItem>
                </SelectContent>
              </Select>
              {/* 필터 초기화 */}
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 bg-transparent"
                onClick={() => {
                  setInputValue("");
                  updateFilters({ q: "", status: "all", page: 1 });
                }}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        {/* 총 건수 헤더 */}
        <div className="border-b border-border/50 px-4 py-3 flex items-center">
          <p className="text-sm font-medium text-muted-foreground">
            총{" "}
            <span className="text-foreground font-semibold">{totalCount}</span>건
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border accent-[oklch(0.55_0.18_250)]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  주문번호
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <button className="flex items-center gap-1">
                    고객 <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider md:table-cell">
                  상품
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <button className="flex items-center gap-1">
                    금액 <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  상태
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider lg:table-cell">
                  결제 수단
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider sm:table-cell">
                  주문일
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    데이터를 불러오는 중입니다...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    조건에 일치하는 주문이 없습니다.
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                  const status = ORDER_STATUS_CONFIG[
                    order.status as OrderStatus
                  ] || {
                    label: order.status,
                    className: "bg-muted text-muted-foreground",
                  };
                  return (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-muted/20"
                    >
                      <td className="px-4 py-4 w-12">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-border accent-[oklch(0.55_0.18_250)]"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-primary">
                          {order.id.split("-")[0].toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {order.customer_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.customer_phone}
                          </p>
                        </div>
                      </td>
                      <td className="hidden px-4 py-4 md:table-cell">
                        <p className="text-sm text-foreground max-w-[200px] truncate">
                          {getProductSummary(order.order_items)}
                        </p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-foreground">
                          {order.total_amount?.toLocaleString() || 0}원
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={cn("border-0 font-medium", status.className)}
                        >
                          {status.label}
                        </Badge>
                      </td>
                      <td className="hidden px-4 py-4 lg:table-cell whitespace-nowrap">
                        <span className="text-sm text-muted-foreground">
                          {getMethodLabel(order.payment_method)}
                        </span>
                      </td>
                      <td className="hidden px-4 py-4 sm:table-cell whitespace-nowrap">
                        <span className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/orders/${order.id}`}>
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Eye className="h-4 w-4" />
                                상세보기
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Truck className="h-4 w-4" />
                              배송 상태 변경
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Package className="h-4 w-4" />
                              송장 입력
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                              주문 취소
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (동적) */}
        <div className="flex items-center justify-center border-t border-border/50 px-4 py-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 bg-transparent hover:bg-primary/10 hover:text-primary border-border/50 transition-colors"
              onClick={() =>
                updateFilters({ page: Math.max(1, currentPage - 1) })
              }
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* 페이지 번호 버튼 (최대 5개 표시) */}
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

            {totalPages > 5 && (
              <span className="px-2 text-muted-foreground">...</span>
            )}

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
              onClick={() =>
                updateFilters({ page: Math.min(totalPages, currentPage + 1) })
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
