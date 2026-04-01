'use server';

import { createAdminClient } from '@/lib/supabase/admin';

interface ChargeBillingArgs {
  subscriptionId: string;
}

export async function chargeBillingAction({ subscriptionId }: ChargeBillingArgs) {
  try {
    const supabase = createAdminClient();

    // 1. 가져오기 (billing_key 필요)
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    if (subError || !subscription) {
      throw new Error('구독 정보를 찾을 수 없습니다.');
    }

    if (subscription.status !== 'active') {
      throw new Error('활성화된 구독이 아닙니다.');
    }

    const billingKey = subscription.billing_key;
    const amount = subscription.amount;
    const tossSecretKey = process.env.TOSS_SECRET_KEY;

    if (!tossSecretKey || !billingKey) {
      throw new Error('내부 서버 오류: 필수 결제 정보가 누락되었습니다.');
    }

    const encodedKey = Buffer.from(`${tossSecretKey}:`).toString('base64');
    
    // 유일한 주문 ID 생성
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 2. 토스 자동결제 실행 API 호출
    const response = await fetch(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encodedKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerKey: subscription.customer_key,
        amount: amount,
        orderId: orderId,
        orderName: '월간 프리미엄 구독',
      }),
    });

    const paymentData = await response.json();

    if (!response.ok) {
      // 결제 실패 시
      await supabase.from('payments').insert({
        user_id: subscription.user_id,
        subscription_id: subscription.id,
        order_id: orderId,
        amount: amount,
        status: 'FAILED',
        item: '월간 프리미엄 구독',
      });
      console.error('Charge Billing Error:', paymentData);
      throw new Error(`결제 실패: ${paymentData.message}`);
    }

    // 결제 성공 시
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    // 결제 내역 저장
    await supabase.from('payments').insert({
      user_id: subscription.user_id,
      subscription_id: subscription.id,
      payment_key: paymentData.paymentKey,
      order_id: orderId,
      amount: amount,
      status: 'DONE',
      item: '월간 프리미엄 구독',
      paid_at: new Date().toISOString(),
    });

    // 구독 다음 결제일 업데이트
    await supabase
      .from('subscriptions')
      .update({ next_billing_at: nextBillingDate.toISOString() })
      .eq('id', subscription.id);

    return {
      success: true,
      message: '결제가 성공적으로 진행되었습니다.',
      paymentKey: paymentData.paymentKey,
      orderId: orderId,
    };
  } catch (error: any) {
    console.error('chargeBillingAction Error:', error);
    return {
      success: false,
      message: error.message || '정기결제 중 오류가 발생했습니다.',
    };
  }
}
