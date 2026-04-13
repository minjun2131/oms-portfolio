"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ORDER_STATUS_CONFIG, OrderStatus } from "@/features/orders/constants/order-status";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useOrders } from "@/features/orders/hooks/queries/use-orders";

export function RecentOrders() {
  const { data: result, isLoading } = useOrders({ page: 1 });
  const recentOrders = result?.data?.slice(0, 5) ?? [];

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold text-card-foreground">
          최근 주문
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/80 gap-1"
          asChild
        >
          <Link href="/orders">
            전체보기 <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              불러오는 중...
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              최근 주문이 없습니다.
            </div>
          ) : (
            recentOrders.map((order: any) => {
              const status = ORDER_STATUS_CONFIG[order.status as OrderStatus] || {
                label: order.status,
                className: "bg-muted text-muted-foreground",
              };
              const firstItem = order.order_items?.[0];
              const productLabel = order.order_items?.length > 1 
                ? `${firstItem?.product_name || '상품'} 외 ${order.order_items.length - 1}건`
                : firstItem?.product_name || '상품 정보 없음';

              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">
                        {productLabel}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer_name} · {order.order_number || order.id.split("-")[0].toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-card-foreground">
                        ₩{(order.total_amount || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "border-0 font-medium",
                        status.className
                      )}
                    >
                      {status.label}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
