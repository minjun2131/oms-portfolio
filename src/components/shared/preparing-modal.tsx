"use client";

import React from "react";
import { Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PreparingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreparingModal({ isOpen, onOpenChange }: PreparingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none bg-background/60 backdrop-blur-xl shadow-2xl">
        <div className="relative p-8 flex flex-col items-center text-center">
          {/* Close Button Overlay */}
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-foreground/5 transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Icon with Gradient background */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
              <Sparkles className="h-10 w-10 text-white animate-pulse" />
            </div>
          </div>

          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              준비 중인 기능입니다
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground leading-relaxed px-2">
              더 나은 서비스를 위해 현재 <span className="text-foreground font-medium">열심히 개발 중</span>에 있습니다. <br />
              조금만 더 기다려 주세요!
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 w-full">
            <Button 
              onClick={() => onOpenChange(false)}
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
            >
              확인
            </Button>
          </div>
        </div>

        {/* Bottom Decorative Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </DialogContent>
    </Dialog>
  );
}
