"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in widget:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 border border-destructive/20 bg-destructive/5 rounded-lg text-center space-y-3 min-h-[200px]">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-destructive">
              데이터를 불러오지 못했습니다.
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2 px-4">
              {this.state.error?.message || "알 수 없는 오류가 발생했습니다."}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-2 border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            onClick={this.handleReset}
          >
            <RefreshCcw className="h-3 w-3" />
            다시 시도
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
