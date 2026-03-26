"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러를 로깅 서비스에 기록할 수 있습니다.
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center space-y-8 animate-in fade-in zoom-in duration-300">
      <div className="relative">
        <div className="absolute inset-0 bg-destructive/10 blur-3xl rounded-full scale-150 animate-pulse" />
        <AlertCircle className="relative h-24 w-24 text-destructive mx-auto" />
      </div>

      <div className="space-y-4 max-w-md mx-auto relative">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          죄송합니다, 오류가 발생했습니다.
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          데이터를 불러오거나 처리하는 과정에서 예기치 못한 문제가 발생했습니다. 
          일시적인 문제일 수 있으니 다시 시도해 주시기 바랍니다.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-4">
        <Button 
          variant="default" 
          size="lg" 
          className="gap-2 min-w-[140px]" 
          onClick={() => reset()}
        >
          <RefreshCcw className="h-4 w-4" />
          다시 시도하기
        </Button>
        <Link href="/">
          <Button variant="outline" size="lg" className="gap-2 min-w-[140px]">
            <Home className="h-4 w-4" />
            홈으로 이동
          </Button>
        </Link>
      </div>

      <div className="pt-12 text-xs text-muted-foreground/60 font-mono">
        <p>에러 코드: {error.digest || "정보 없음"}</p>
      </div>
    </div>
  );
}
