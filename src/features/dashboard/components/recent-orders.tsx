import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ORDER_STATUS_CONFIG, OrderStatus } from "@/features/orders/constants/order-status";
import { cn } from "@/lib/utils";

const orders = [
  {
    id: "ORD-2024-0128",
    customer: "이지은",
    product: "아크릴 키링 세트",
    amount: "₩32,000",
    status: "shipping" as OrderStatus,
    date: "2분 전",
  },
  {
    id: "ORD-2024-0127",
    customer: "박민수",
    product: "포토카드 풀세트",
    amount: "₩45,000",
    status: "paid" as OrderStatus,
    date: "15분 전",
  },
  {
    id: "ORD-2024-0126",
    customer: "김하늘",
    product: "미니 포스터 3종",
    amount: "₩18,000",
    status: "delivered" as OrderStatus,
    date: "1시간 전",
  },
  {
    id: "ORD-2024-0125",
    customer: "정수현",
    product: "스티커 팩 (5종)",
    amount: "₩12,500",
    status: "preparing" as OrderStatus,
    date: "2시간 전",
  },
  {
    id: "ORD-2024-0124",
    customer: "최영호",
    product: "아크릴 스탠드",
    amount: "₩28,000",
    status: "shipping" as OrderStatus,
    date: "3시간 전",
  },
];

export function RecentOrders() {
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
        >
          전체보기 <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">
                    {order.product}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.customer} · {order.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-card-foreground">
                    {order.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "border-0 font-medium",
                    ORDER_STATUS_CONFIG[order.status].className
                  )}
                >
                  {ORDER_STATUS_CONFIG[order.status].label}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
