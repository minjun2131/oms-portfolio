"use client";

import { Suspense, ReactNode } from "react";
import { ErrorBoundary } from "./error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DashboardWidgetProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

export function DashboardWidget({
  children,
  fallback,
  onReset,
}: DashboardWidgetProps) {
  // 기본 위젯 스켈레톤 UI
  const defaultFallback = (
    <Card className="border-border/50 shadow-sm min-h-[250px] animate-pulse">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <Skeleton className="h-5 w-[100px]" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            </div>
            <Skeleton className="h-6 w-[60px]" />
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <ErrorBoundary 
      onReset={onReset} 
      fallback={fallback}
    >
      <Suspense fallback={fallback || defaultFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
