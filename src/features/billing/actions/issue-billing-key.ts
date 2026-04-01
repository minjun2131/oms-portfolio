'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

interface IssueBillingKeyArgs {
  authKey: string;
  customerKey: string;
}

export async function issueBillingKeyAction({ authKey, customerKey }: IssueBillingKeyArgs) {
  try {
    // 1. 유저 인증 정보 확인
    const supabaseSessionClient = await createClient();
    const { data: { user }, error: userError } = await supabaseSessionClient.auth.getUser();

    // 2. 관리자 권한 클라이언트로 DB 인서트 준비 (billing_key는 클라이언트 노출되면 안됨)
    // admin 클라이언트를 사용하여 RLS 정책 우회하거나 서버 로직에서만 테이블 접근
    const supabase = createAdminClient();

    let userId = user?.id;

    // 인증되지 않은 경우 에러 처리 (로그인 상태여야 함)
    // 테스트 환경 등에서는 넘어온 user_id를 쓸 수도 있지만 보안상 현재 세션 유저 강제
    if (!userId) {
      // return { success: false, message: '인증되지 않은 사용자입니다.' };
      throw new Error('Unauthorized user');
    }

    // 3. 토스페이먼츠 빌링키 발급 API 호출
    const tossSecretKey = process.env.TOSS_SECRET_KEY;
    if (!tossSecretKey) {
      throw new Error('TOSS_SECRET_KEY is not defined.');
    }

    // Toss API 인증 헤더 (시크릿 키 뒤에 콜론(:)을 붙여서 Base64 인코딩)
    const encodedKey = Buffer.from(`${tossSecretKey}:`).toString('base64');

    const tossResponse = await fetch('https://api.tosspayments.com/v1/billing/authorizations/issue', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encodedKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authKey,
        customerKey,
      }),
    });

    if (!tossResponse.ok) {
      const errorData = await tossResponse.json();
      console.error('Toss Billing Issue Error:', errorData);
      throw new Error(`토스 빌링키 발급 실패: ${errorData.message}`);
    }

    const billingData = await tossResponse.json();
    const billingKey = billingData.billingKey;

    // 4. Supabase subscriptions 테이블에 저장
    const { error: insertError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        billing_key: billingKey,
        customer_key: customerKey,
        status: 'active',
        plan: 'monthly_plan', // 기본값
        amount: 9900,         // 구독료 기본값
        started_at: new Date().toISOString(),
      });

    if (insertError) {
      throw insertError;
    }

    return {
      success: true,
      message: '결제 수단이 성공적으로 등록되었습니다.',
    };
  } catch (error: any) {
    console.error('issueBillingKeyAction Error:', error);
    return {
      success: false,
      message: error.message || '서버 오류가 발생했습니다.',
    };
  }
}
