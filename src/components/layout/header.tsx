"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PreparingModal } from "@/components/shared/preparing-modal";
import { useReports } from "@/features/reports/hooks/queries/use-reports";

export function Header() {
  const [isPreparingOpen, setIsPreparingOpen] = useState(false);

  // 오늘의 매출 데이터를 위한 범위 설정 (오늘 00:00:00 ~ 현재)
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

  const { data: reports } = useReports({ from: todayStart, to: todayEnd });

  // dailyRevenue 배열에서 오늘치 합계 계산 (데이터가 없을 경우 0)
  const todayRevenue = reports?.dailyRevenue?.reduce((acc, curr) => acc + curr.sales, 0) || 0;

  return (
    <>
    <header className="sticky top-0 z-20 hidden border-b border-border bg-card/80 backdrop-blur-sm lg:block">
      <div className="flex h-16 items-center justify-end px-8">

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 text-muted-foreground hover:text-foreground"
            onClick={() => setIsPreparingOpen(true)}
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary p-0 text-[10px] text-primary-foreground flex items-center justify-center">
              3
            </Badge>
          </Button>
          <div className="h-8 w-px bg-border" />
          <div className="text-right">
            <p className="text-sm font-medium text-muted-foreground">오늘의 매출</p>
            <p className="text-lg font-bold text-primary">
              ₩{todayRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </header>
    <PreparingModal 
      isOpen={isPreparingOpen} 
      onOpenChange={setIsPreparingOpen} 
    />
    </>
  );
}
