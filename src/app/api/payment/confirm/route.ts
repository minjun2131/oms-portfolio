import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 로그인 확인
    if (!user) {
      return NextResponse.json(
        { success: false, message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { success: false, message: '잘못된 결제 요청입니다. 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 서버 키는 클라이언트에 절대 노출해서는 안 됨
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      throw new Error('토스 페이먼츠 서버 시크릿 키가 설정되지 않았습니다.');
    }

    // Toss API 인증 헤더용 Base64 인코딩
    // 비밀번호는 없으므로 시크릿 키 뒤에 콜론(:)을 붙여서 인코딩
    const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64');

    // 1. 토스 페이먼츠 결제 승인 API 호출
    const confirmResponse = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const paymentData = await confirmResponse.json();

    if (!confirmResponse.ok) {
      console.error('Toss Payments Confirm Error:', paymentData);
      return NextResponse.json(
        { 
          success: false, 
          message: paymentData?.message || '토스 결제 승인에 실패했습니다.' 
        },
        { status: confirmResponse.status }
      );
    }

    // 2. Supabase payments 테이블에 저장
    const { error: dbError } = await supabase
      .from('payments' as any)
      .insert({
        user_id: user.id,
        subscription_id: null,
        payment_key: paymentKey,
        order_id: orderId,
        amount: Number(amount),
        status: 'DONE',
        item: 'OMS Pro 구독 (단건 결제)',
        paid_at: new Date().toISOString(),
      } as any);

    if (dbError) {
      console.error('\n🚨 [DB Insert Error]: payments 테이블에 저장 실패!');
      console.error('에러 내용:', dbError);
      if (dbError.code === 'PGRST205') {
        console.error('👉 원인: payments 테이블이 데이터베이스에 존재하지 않습니다.');
        console.error(`👉 해결: Supabase SQL Editor에서 다음 SQL을 실행해주세요:
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  payment_key text,
  order_id text unique not null,
  amount numeric not null,
  status text not null,
  item text,
  paid_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);`);
      }
      // 결제는 성공했으나 DB 저장만 실패한 상태
      // 이 경우 프론트엔드에서는 결제 성공 화면을 띄워주는 것이 안전함 (나중에 배치 작업 등으로 상태 동기화 필요)
    }

    return NextResponse.json({
      success: true,
      message: '결제가 성공적으로 완료되었습니다.',
    });

  } catch (error: any) {
    console.error('Payment confirm exception:', error);
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
