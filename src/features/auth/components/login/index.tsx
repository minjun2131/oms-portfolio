"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ROUTES } from "@/constants/url";
import { useSignIn } from "@/features/auth/hooks/mutations/use-sign-in";
import { useRouter } from "next/navigation";

import { NaverLoginButton } from "@/features/auth/components/NaverLoginButton";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutateAsync: signIn, isPending: isLoading } = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn({ email, password });
      router.push(ROUTES.HOME);
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(error.message || "로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-6 h-6 text-primary-foreground"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-2xl font-bold tracking-tight text-foreground">
          셀러플로우
        </span>
      </div>

      {/* Header */}
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-2xl font-bold text-foreground">로그인</h2>
        <p className="text-muted-foreground">
          계정에 로그인하여 비즈니스를 관리하세요
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              이메일 주소
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 px-4 bg-card border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                비밀번호
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                비밀번호 찾기
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 px-4 pr-12 bg-card border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <label
            htmlFor="remember"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            로그인 상태 유지
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              로그인
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">또는 소셜 계정으로 로그인</span>
        </div>
      </div>

      {/* Social Login */}
      <div className="flex flex-col gap-3">
        <NaverLoginButton />
      </div>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground">
        아직 계정이 없으신가요?{" "}
        <Link
          href={ROUTES.REGISTER}
          className="font-medium text-primary hover:text-primary/80 transition-colors"
        >
          회원가입
        </Link>
      </p>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground pt-4">
        로그인하면 셀러플로우의{" "}
        <Link
          href="/terms"
          className="underline hover:text-foreground transition-colors"
        >
          이용약관
        </Link>{" "}
        및{" "}
        <Link
          href="/privacy"
          className="underline hover:text-foreground transition-colors"
        >
          개인정보처리방침
        </Link>
        에 동의하게 됩니다.
      </p>
    </div>
  );
}
