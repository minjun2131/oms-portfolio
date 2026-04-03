import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "로그인 | 셀러플로우",
  description: "셀러플로우에 로그인하여 비즈니스를 관리하세요.",
};

/**
 * 좌측 브랜딩 패널 - 상태가 없으므로 Server Component로 유지
 */
function LoginBranding() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(0.55_0.18_250)_0%,oklch(0.45_0.2_260)_100%)]" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary-foreground/5 blur-3xl" />
      <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
        <div>
          <h1 className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="셀러플로우"
              width={44}
              height={44}
              className="rounded-xl"
            />
            <span className="text-2xl font-bold tracking-tight">셀러플로우</span>
          </h1>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight text-balance">
              인디 판매자를 위한
              <br />
              스마트한 굿즈 관리
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-md leading-relaxed">
              재고 관리부터 주문 처리까지, 셀러플로우와 함께 더 쉽고 빠르게
              비즈니스를 운영하세요.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-4">
            {[
              "실시간 재고 및 주문 현황 파악",
              "간편한 상품 등록 및 관리",
              "매출 분석 및 리포트 자동 생성",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-primary-foreground/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-primary-foreground/60">
          10,000명 이상의 인디 판매자가 신뢰하는 플랫폼
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-background">
      <LoginBranding />

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <LoginForm />
      </div>
    </div>
  );
}
