"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Store,
  MoreHorizontal,
  MapPin,
  Globe,
  Package,
  ShoppingCart,
  TrendingUp,
  Settings,
  Eye,
  Edit3,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { mockStores } from "@/features/stores/constants/mock-data";

const summaryStats = [
  {
    label: "관리 중인 상점",
    value: "4",
    icon: <Store className="h-5 w-5" />,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "총 등록 상품",
    value: "169",
    icon: <Package className="h-5 w-5" />,
    color: "text-[oklch(0.65_0.18_145)]",
    bgColor: "bg-[oklch(0.65_0.18_145)]/10",
  },
  {
    label: "이번 달 총 주문",
    value: "410",
    icon: <ShoppingCart className="h-5 w-5" />,
    color: "text-[oklch(0.75_0.15_85)]",
    bgColor: "bg-[oklch(0.75_0.15_85)]/15",
  },
  {
    label: "이번 달 총 매출",
    value: "₩25,250,000",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "text-[oklch(0.6_0.15_30)]",
    bgColor: "bg-[oklch(0.6_0.15_30)]/10",
  },
];

export function StoreList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">상점 관리</h1>
          <p className="mt-1 text-muted-foreground">
            관리 중인 상점을 확인하고 설정하세요
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              상점 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>새 상점 추가</DialogTitle>
              <DialogDescription>
                관리할 새 상점 정보를 입력하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  상점명 <span className="text-destructive">*</span>
                </label>
                <Input placeholder="예: 봄날의 아틀리에" className="h-11" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  카테고리
                </label>
                <Select>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="illust">일러스트 굿즈</SelectItem>
                    <SelectItem value="photo">포토카드 / 인쇄물</SelectItem>
                    <SelectItem value="fabric">패브릭 / 소품</SelectItem>
                    <SelectItem value="digital">디지털 아트 굿즈</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  주소
                </label>
                <Input placeholder="상점 주소 입력" className="h-11" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    연락처
                  </label>
                  <Input placeholder="02-0000-0000" className="h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    웹사이트
                  </label>
                  <Input placeholder="example.com" className="h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  상점 소개
                </label>
                <Textarea
                  placeholder="상점에 대한 간단한 설명을 입력하세요"
                  className="resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="bg-transparent"
              >
                취소
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>상점 추가</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <Card key={stat.label} className="border-border/50 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  stat.bgColor,
                  stat.color
                )}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="상점명으로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 pl-10"
        />
      </div>

      {/* Store Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {mockStores.map((store) => (
          <Card
            key={store.id}
            className="border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground">
                      {store.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {store.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "border-0 font-medium text-xs whitespace-nowrap",
                      store.status === "active"
                        ? "bg-[oklch(0.65_0.18_145)]/10 text-[oklch(0.5_0.18_145)]"
                        : "bg-[oklch(0.75_0.15_85)]/15 text-[oklch(0.55_0.15_85)]"
                    )}
                  >
                    {store.status === "active" ? "운영중" : "일시정지"}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2 focus:bg-accent focus:text-accent-foreground cursor-pointer flex items-center">
                        <Eye className="h-4 w-4" />
                        상점 상세
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 focus:bg-accent focus:text-accent-foreground cursor-pointer flex items-center">
                        <Edit3 className="h-4 w-4" />
                        정보 수정
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 focus:bg-accent focus:text-accent-foreground cursor-pointer flex items-center">
                        <Settings className="h-4 w-4" />
                        설정
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 focus:bg-accent focus:text-accent-foreground cursor-pointer flex items-center">
                        <ExternalLink className="h-4 w-4" />
                        웹사이트 방문
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {store.description}
              </p>

              {/* Store Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-muted/40 p-3 text-center">
                  <p className="text-lg font-bold text-foreground">
                    {store.products}
                  </p>
                  <p className="text-xs text-muted-foreground">상품</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-3 text-center">
                  <p className="text-lg font-bold text-foreground">
                    {store.monthlyOrders}
                  </p>
                  <p className="text-xs text-muted-foreground">이달 주문</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-3 text-center">
                  <p className="text-lg font-bold text-foreground">
                    {store.monthlySales > 0
                      ? `${(store.monthlySales / 10000).toFixed(0)}만`
                      : "-"}
                  </p>
                  <p className="text-xs text-muted-foreground">이달 매출</p>
                </div>
              </div>

              {/* Store Info */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">{store.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-3.5 w-3.5" />
                    <span>{store.website}</span>
                  </div>
                  {store.growth !== 0 && (
                    <div className="flex items-center gap-1">
                      {store.growth > 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 text-[oklch(0.65_0.18_145)]" />
                      ) : (
                        <TrendingUp className="h-3.5 w-3.5 text-destructive rotate-180" />
                      )}
                      <span
                        className={cn(
                          "text-xs font-medium",
                          store.growth > 0
                            ? "text-[oklch(0.65_0.18_145)]"
                            : "text-destructive"
                        )}
                      >
                        {store.growth > 0 ? "+" : ""}
                        {store.growth}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
