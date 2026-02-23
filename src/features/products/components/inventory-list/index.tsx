"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ArrowLeft,
  AlertTriangle,
  TrendingDown,
  Package,
  RefreshCw,
  Download,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from "@/features/products/types";

import { mockInventoryItems } from "@/mocks/products";
import type { InventoryItem } from "@/mocks/products";

export function InventoryList() {
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const lowStockCount = items.filter(
    (item) => item.currentStock <= item.minStock && item.currentStock > 0
  ).length;
  const outOfStockCount = items.filter((item) => item.currentStock === 0).length;
  const totalStock = items.reduce((sum, item) => sum + item.currentStock, 0);

  const handleAdjustmentChange = (id: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setAdjustments({ ...adjustments, [id]: numValue });
  };

  const handleIncrement = (id: string) => {
    const current = adjustments[id] || 0;
    setAdjustments({ ...adjustments, [id]: current + 1 });
  };

  const handleDecrement = (id: string) => {
    const current = adjustments[id] || 0;
    setAdjustments({ ...adjustments, [id]: current - 1 });
  };

  const handleUpdate = (id: string) => {
    const adjustment = adjustments[id] || 0;
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, currentStock: Math.max(0, item.currentStock + adjustment) }
          : item
      )
    );
    setAdjustments({ ...adjustments, [id]: 0 }); // 리셋
  };

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) {
      return (
        <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-0 gap-1 flex items-center w-fit">
          <AlertTriangle className="h-3 w-3" />
          품절
        </Badge>
      );
    }
    if (current <= min) {
      return (
        <Badge className="bg-[oklch(0.75_0.15_85)]/10 text-[oklch(0.55_0.15_85)] hover:bg-[oklch(0.75_0.15_85)]/20 border-0 gap-1 flex items-center w-fit">
          <TrendingDown className="h-3 w-3" />
          부족
        </Badge>
      );
    }
    return (
      <Badge className="bg-[oklch(0.65_0.18_145)]/10 text-[oklch(0.5_0.15_145)] hover:bg-[oklch(0.65_0.18_145)]/20 border-0">
        정상
      </Badge>
    );
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
            <h1 className="text-2xl font-bold text-foreground">재고 관리</h1>
            <p className="mt-1 text-muted-foreground">
              상품의 재고를 실시간으로 관리하세요
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              내보내기
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              새로고침
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">총 재고</p>
              <p className="text-2xl font-bold text-foreground">
                {totalStock.toLocaleString()}개
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.75_0.15_85)]/10">
              <TrendingDown className="h-6 w-6 text-[oklch(0.55_0.15_85)]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">재고 부족</p>
              <p className="text-2xl font-bold text-[oklch(0.55_0.15_85)]">
                {lowStockCount}개 상품
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">품절 상품</p>
              <p className="text-2xl font-bold text-destructive">
                {outOfStockCount}개 상품
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="상품명 또는 SKU로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="재고 상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="low">재고 부족</SelectItem>
                  <SelectItem value="out">품절</SelectItem>
                  <SelectItem value="normal">정상</SelectItem>
                </SelectContent>
              </Select>
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
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-base font-medium">재고 현황</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    상품 정보
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    현재 재고
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    상태
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    입고/출고
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b border-border/30 transition-colors hover:bg-muted/20 ${
                      item.currentStock <= item.minStock
                        ? "bg-destructive/[0.02]"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-4 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-muted-foreground">
                        {item.sku}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span
                        className={`text-lg font-bold ${
                          item.currentStock === 0
                            ? "text-destructive"
                            : item.currentStock <= item.minStock
                            ? "text-[oklch(0.55_0.15_85)]"
                            : "text-foreground"
                        }`}
                      >
                        {item.currentStock}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {" "}
                        / 최소 {item.minStock}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center flex justify-center whitespace-nowrap">
                      {getStockStatus(item.currentStock, item.minStock)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => handleDecrement(item.id)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={adjustments[item.id] || 0}
                          onChange={(e) =>
                            handleAdjustmentChange(item.id, e.target.value)
                          }
                          className="h-8 w-16 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => handleIncrement(item.id)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(item.id)}
                        disabled={!adjustments[item.id]}
                        className="h-8"
                      >
                        업데이트
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
