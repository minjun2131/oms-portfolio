import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "회원가입 | 셀러플로우",
  description: "셀러플로우에 가입하고 나만의 굿즈 스토어를 시작하세요.",
};

/**
 * 좌측 브랜딩 패널 - 상태가 없으므로 Server Component로 유지
 */
function SignupBranding() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(0.55_0.18_250)_0%,oklch(0.45_0.2_260)_100%)]" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary-foreground/5 blur-3xl" />
      <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
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
            <span className="text-2xl font-bold tracking-tight">셀러플로우</span>
          </Link>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight text-balance">
              지금 시작하고
              <br />
              비즈니스를 성장시키세요
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-md leading-relaxed">
              간편한 가입 절차로 몇 분 안에 나만의 굿즈 스토어를 관리할 수
              있습니다.
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-4">
            {[
              "무료로 시작, 언제든 업그레이드",
              "5분 만에 첫 상품 등록 완료",
              "전문 고객 지원팀 상시 운영",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
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
                <span className="text-primary-foreground/90">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-primary-foreground/60">
          이미 10,000명 이상의 인디 판매자가 함께하고 있습니다
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-background">
      <SignupBranding />

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <RegisterForm />
      </div>
    </div>
  );
}
