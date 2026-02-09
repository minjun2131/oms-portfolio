"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Truck, MessageSquare } from "lucide-react";

const actions = [
  {
    label: "상품 등록",
    icon: <Plus className="h-5 w-5" />,
    description: "새 굿즈 등록하기",
    variant: "default" as const,
  },
  {
    label: "송장 입력",
    icon: <Truck className="h-5 w-5" />,
    description: "배송 정보 업데이트",
    variant: "outline" as const,
  },
  {
    label: "리포트",
    icon: <FileText className="h-5 w-5" />,
    description: "매출 리포트 생성",
    variant: "outline" as const,
  },
  {
    label: "문의 확인",
    icon: <MessageSquare className="h-5 w-5" />,
    description: "고객 문의 3건",
    variant: "outline" as const,
  },
];

export function QuickActions() {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-card-foreground">
          빠른 실행
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            className={`h-auto flex-col gap-2 py-4 ${
              action.variant === "default"
                ? "bg-primary hover:bg-primary/90"
                : "hover:bg-muted/50"
            }`}
          >
            {action.icon}
            <span className="text-sm font-medium">{action.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
