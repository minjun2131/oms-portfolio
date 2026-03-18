"use client";

import { useState, useMemo } from "react";
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
  ShoppingCart,
  Clock,
  Package,
  CheckCircle2,
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

const statusConfig: Record<string, { label: string; className: string }> = {
  paid: {
    label: "결제완료",
    className: "bg-[oklch(0.65_0.18_145)]/10 text-[oklch(0.5_0.18_145)]",
  },
  pending: {
    label: "입금대기",
    className: "bg-[oklch(0.75_0.15_85)]/15 text-[oklch(0.55_0.15_85)]",
  },
  preparing: {
    label: "상품준비중",
    className: "bg-[oklch(0.75_0.15_85)]/15 text-[oklch(0.55_0.15_85)]",
  },
  shipping: {
    label: "배송중",
    className: "bg-[oklch(0.55_0.18_250)]/10 text-[oklch(0.55_0.18_250)]",
  },
  delivered: {
    label: "배송완료",
    className: "bg-muted text-muted-foreground",
  },
  cancelled: {
    label: "취소",
    className: "bg-destructive/10 text-destructive",
  },
};

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

const summaryCards = [
  {
    label: "전체 주문",
    value: "1,284",
    icon: <ShoppingCart className="h-5 w-5" />,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "결제 대기",
    value: "23",
    icon: <Clock className="h-5 w-5" />,
    color: "text-[oklch(0.75_0.15_85)]",
    bgColor: "bg-[oklch(0.75_0.15_85)]/15",
  },
  {
    label: "배송중",
    value: "45",
    icon: <Truck className="h-5 w-5" />,
    color: "text-[oklch(0.55_0.18_250)]",
    bgColor: "bg-[oklch(0.55_0.18_250)]/10",
  },
  {
    label: "배송 완료",
    value: "1,216",
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: "text-[oklch(0.5_0.18_145)]",
    bgColor: "bg-[oklch(0.65_0.18_145)]/10",
  },
];

export function OrderList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders = [], isLoading } = useOrders({
    search: searchQuery,
    status: statusFilter,
  });

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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="주문번호, 고객명, 상품명으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
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
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 bg-transparent"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
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
                  <td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    데이터를 불러오는 중입니다...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    조건에 일치하는 주문이 없습니다.
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => {
                  const status = statusConfig[order.status] || {
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
                          variant="secondary"
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

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-4">
          <p className="text-sm text-muted-foreground">
            총 1,284건 중 1~8건 표시
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="bg-transparent"
            >
              이전
            </Button>
            <Button size="sm" className="h-8 w-8 p-0">
              1
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground"
            >
              2
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground"
            >
              3
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent"
            >
              다음
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
