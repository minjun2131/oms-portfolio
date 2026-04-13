'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PRICING_PLANS, PRICING_FEATURES } from '../constants/data';
import { useTossBilling } from '../hooks/use-toss-billing';
import Link from 'next/link';

interface PricingViewProps {
  customerKey?: string | null;
  customerEmail?: string | null;
  customerName?: string | null;
}

export function PricingView({ customerKey, customerEmail, customerName }: PricingViewProps) {
  const router = useRouter();
  const { requestPayment, isLoading } = useTossBilling();

  const handleStartNow = async (planId: string) => {
    if (planId === 'free') {
      if (!customerKey) {
        router.push('/login');
      } else {
        router.push('/dashboard');
      }
      return;
    }

    if (planId === 'pro') {
      if (!customerKey) {
        toast.warning('로그인이 필요한 서비스입니다.');
        router.push('/login');
        return;
      }
      
      try {
        // 토스 페이먼츠 결제창 호출
        await requestPayment({
          customerKey,
          customerEmail: customerEmail || 'customer@email.com',
          customerName: customerName || '홍길동',
        });
      } catch (error) {
        console.error('Failed to request payment:', error);
        toast.error('결제 초기화에 실패했습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* 헤더 */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                O
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">OMS</h1>
                <p className="hidden sm:block text-sm text-muted-foreground">주문·배달·매출 관리 서비스</p>
              </div>
            </Link>
            <div className="space-x-3">
              {customerKey ? (
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">대시보드로 돌아가기</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild><Link href="/login">로그인</Link></Button>
                  <Button asChild><Link href="/register">회원가입</Link></Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* 상단 제목 */}
        <div className="mb-16 text-center">
          <h2 className="text-balance text-4xl font-bold text-foreground sm:text-5xl">
            당신의 비즈니스를 위한 딱 맞는 플랜
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            모든 규모의 사업을 위한 강력한 주문 관리 솔루션
          </p>
        </div>

        {/* 플랜 카드 */}
        <div className="mb-20 grid gap-6 lg:grid-cols-2">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-8 transition-all duration-300 ${
                plan.highlight
                  ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg'
                  : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
              }`}
            >
              {/* 추천 배지 */}
              {plan.badge && (
                <div className="absolute -top-3 left-8">
                  <Badge className="bg-primary text-primary-foreground">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              {/* 플랜 정보 */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* 가격 */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    ₩{plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/{plan.period}</span>
                </div>
                {plan.id === 'free' && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    신용카드 정보 불필요
                  </p>
                )}
                {plan.id === 'pro' && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    첫 7일 무료 체험
                  </p>
                )}
              </div>

              {/* 기능 목록 */}
              <div className="mb-8 space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA 버튼 */}
              <Button
                size="lg"
                className={`w-full font-semibold transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'border-2 border-primary bg-transparent text-primary hover:bg-primary/5'
                }`}
                onClick={() => handleStartNow(plan.id)}
                disabled={isLoading && plan.id === 'pro'}
              >
                {isLoading && plan.id === 'pro' ? '요청 중...' : plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* 기능 소개 섹션 */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h3 className="text-3xl font-bold text-foreground">모든 플랜에서 사용 가능한 핵심 기능</h3>
            <p className="mt-2 text-muted-foreground">
              무료 플랜도 필수 기능을 모두 제공합니다
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PRICING_FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="rounded-xl border border-border bg-card p-6 text-center hover:border-primary/50 transition-colors">
                  <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground">{item.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ / 신뢰 메시지 */}
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="font-semibold text-foreground">자주 묻는 질문</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="text-muted-foreground">
                  <span className="font-medium text-foreground">Q. 언제든 해지할 수 있나요?</span>
                  <p className="mt-1">네, 언제든지 구독을 해지할 수 있습니다. 자동 갱신은 없습니다.</p>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">신뢰할 수 있는 서비스</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  안전한 결제 (토스 페이먼츠)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  99.9% 서버 가용률
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  개인정보 보호 준수
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 여백 */}
      <div className="py-8 text-center">
        <p className="text-xs text-muted-foreground">
          문의사항이 있으신가요? 이메일로 연락주세요 support@oms.kr
        </p>
      </div>
    </div>
  );
}
