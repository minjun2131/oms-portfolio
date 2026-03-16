"use client";

import { useActionState, useState } from "react";
import {
  Plus,
  Search,
  Store,
  MoreHorizontal,
  Package,
  ShoppingCart,
  TrendingUp,
  Edit3,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { useShops } from "../../hooks/queries/use-shops";
import { createShopAction } from "../../actions/create-shop";
import { deleteShopAction } from "../../actions/delete-shop";
import { useQueryClient } from "@tanstack/react-query";
import { shopsQueryKeys } from "../../constants/query-keys";
import type { ShopActionState } from "../../actions/types";

export function StoreList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { data: shops = [], isLoading } = useShops(
    searchQuery ? { search: searchQuery } : undefined
  );

  const [createState, createAction, isCreatePending] = useActionState<
    ShopActionState | null,
    FormData
  >(async (prevState, formData) => {
    const result = await createShopAction(prevState, formData);
    if (result.success) {
      queryClient.invalidateQueries({ queryKey: shopsQueryKeys.lists() });
      setIsCreateDialogOpen(false);
    }
    return result;
  }, null);

  const handleDelete = async (id: string) => {
    if (!confirm("정말로 이 상점을 삭제하시겠습니까?\n연결된 상품의 상점 정보도 함께 해제됩니다.")) return;
    setDeletingId(id);
    try {
      await deleteShopAction(id);
      queryClient.invalidateQueries({ queryKey: shopsQueryKeys.lists() });
    } finally {
      setDeletingId(null);
    }
  };

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

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              상점 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>새 상점 추가</DialogTitle>
              <DialogDescription>
                관리할 새 상점의 이름을 입력하세요.
              </DialogDescription>
            </DialogHeader>
            <form action={createAction}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    상점명 <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="name"
                    placeholder="예: 봄날의 아틀리에"
                    className="h-11"
                    autoFocus
                  />
                  {createState && !createState.success && createState.errors.name && (
                    <p className="text-xs text-destructive">
                      {createState.errors.name[0]}
                    </p>
                  )}
                </div>
                {createState && !createState.success && createState.message && (
                  <p className="text-sm text-destructive">{createState.message}</p>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="bg-transparent"
                >
                  취소
                </Button>
                <Button type="submit" disabled={isCreatePending} className="gap-2">
                  {isCreatePending && <Loader2 className="h-4 w-4 animate-spin" />}
                  상점 추가
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "관리 중인 상점",
            value: String(shops.length),
            icon: <Store className="h-5 w-5" />,
            color: "text-primary",
            bgColor: "bg-primary/10",
          },
          {
            label: "총 등록 상품",
            value: "-",
            icon: <Package className="h-5 w-5" />,
            color: "text-[oklch(0.65_0.18_145)]",
            bgColor: "bg-[oklch(0.65_0.18_145)]/10",
          },
          {
            label: "이번 달 총 주문",
            value: "-",
            icon: <ShoppingCart className="h-5 w-5" />,
            color: "text-[oklch(0.75_0.15_85)]",
            bgColor: "bg-[oklch(0.75_0.15_85)]/15",
          },
          {
            label: "이번 달 총 매출",
            value: "-",
            icon: <TrendingUp className="h-5 w-5" />,
            color: "text-[oklch(0.6_0.15_30)]",
            bgColor: "bg-[oklch(0.6_0.15_30)]/10",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor} ${stat.color}`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
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

      {/* Store List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : shops.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Store className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-base font-medium text-muted-foreground">
            {searchQuery ? "검색 결과가 없습니다." : "등록된 상점이 없습니다."}
          </p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            {!searchQuery && "상점 추가 버튼을 눌러 첫 상점을 등록해보세요."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <Card
              key={shop.id}
              className="border-border/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{shop.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {shop.createdAt
                          ? new Date(shop.createdAt).toLocaleDateString("ko-KR")
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2 cursor-pointer flex items-center">
                        <Edit3 className="h-4 w-4" />
                        정보 수정
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer flex items-center text-destructive focus:text-destructive"
                        onClick={() => handleDelete(shop.id)}
                        disabled={deletingId === shop.id}
                      >
                        {deletingId === shop.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        상점 삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
