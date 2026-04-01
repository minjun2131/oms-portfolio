// ============================================================
// Toss Payments 구독 결제 관련 타입 정의
// ============================================================

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';
export type PaymentStatus = 'DONE' | 'FAILED' | 'CANCELLED';

/** Supabase subscriptions 테이블 */
export interface Subscription {
  id: string;
  user_id: string;
  billing_key: string;     // 서버에서만 관리 (절대 클라이언트 노출 금지)
  customer_key: string;
  status: SubscriptionStatus;
  plan: string;
  amount: number;
  started_at: string;
  next_billing_at: string | null;
  cancelled_at: string | null;
  created_at: string;
}

/** Supabase payments 테이블 */
export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string | null;
  payment_key: string | null;
  order_id: string;
  amount: number;
  status: PaymentStatus;
  item: string | null;
  paid_at: string | null;
  created_at: string;
}

/** 토스 빌링키 발급 API 응답 (/v1/billing/authorizations/issue) */
export interface TossBillingIssueResponse {
  mId: string;
  customerKey: string;
  authenticatedAt: string;
  billingKey: string;
  card: {
    issuerCode: string;
    acquirerCode: string;
    number: string;        // 마스킹된 카드번호 (예: 43XX-XXXX-XXXX-4060)
    cardType: string;      // 신용, 체크 등
    ownerType: string;     // 개인, 법인
  };
}

/** 토스 정기결제 실행 API 응답 (/v1/billing/{billingKey}) */
export interface TossChargeResponse {
  mId: string;
  lastTransactionKey: string;
  paymentKey: string;
  orderId: string;
  orderName: string;
  status: string;
  requestedAt: string;
  approvedAt: string;
  totalAmount: number;
  method: string;
}

/** 빌링키 발급 API Route 요청 body */
export interface IssueBillingKeyRequest {
  authKey: string;
  customerKey: string;
  plan: string;
  amount: number;
}

/** 정기결제 실행 서버 액션 결과 */
export interface ChargeBillingResult {
  success: boolean;
  message: string;
  paymentKey?: string;
  orderId?: string;
}
