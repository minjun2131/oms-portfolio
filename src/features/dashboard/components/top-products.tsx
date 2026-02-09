"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const products = [
  {
    name: "아크릴 키링 세트 (6종)",
    sales: 234,
    revenue: "₩4,680,000",
    stock: 45,
    progress: 95,
  },
  {
    name: "포토카드 풀세트",
    sales: 189,
    revenue: "₩8,505,000",
    stock: 23,
    progress: 78,
  },
  {
    name: "미니 포스터 (A4)",
    sales: 156,
    revenue: "₩2,340,000",
    stock: 89,
    progress: 65,
  },
  {
    name: "스티커 팩 (5종)",
    sales: 142,
    revenue: "₩1,775,000",
    stock: 156,
    progress: 58,
  },
];

export function TopProducts() {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold text-card-foreground">
          인기 상품
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/80 gap-1"
        >
          전체보기 <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {products.map((product, index) => (
          <div key={product.name} className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary shrink-0">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    판매 {product.sales}건 · 재고 {product.stock}개
                  </p>
                </div>
              </div>
              <p className="text-sm font-semibold text-card-foreground whitespace-nowrap">
                {product.revenue}
              </p>
            </div>
            <Progress value={product.progress} className="h-1.5" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
