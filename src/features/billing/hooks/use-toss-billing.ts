import { useState } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

interface BillingAuthParams {
  customerKey: string;
  customerEmail: string;
  customerName: string;
}

export function useTossBilling() {
  const [isLoading, setIsLoading] = useState(false);

  const requestPayment = async ({ customerKey, customerEmail, customerName }: BillingAuthParams) => {
    try {
      setIsLoading(true);
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
      
      if (!clientKey) {
        throw new Error('토스 페이먼츠 클라이언트 키가 설정되지 않았습니다.');
      }

      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey });
      
      const orderId = `OMS_PRO_${new Date().getTime()}`;
      
      // 토스 페이먼츠 일반 결제 팝업 호출
      await payment.requestPayment({
        method: 'CARD', // Toss Payments SDK v2
        amount: {
          currency: 'KRW',
          value: 9900,
        },
        orderId,
        orderName: 'OMS Pro 구독',
        successUrl: `${window.location.origin}/subscribe/success`,
        failUrl: `${window.location.origin}/subscribe/fail`,
        customerEmail,
        customerName,
      });
    } catch (error) {
      console.error('Failed to request payment:', error);
      alert('결제 초기화에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return { requestPayment, isLoading };
}
