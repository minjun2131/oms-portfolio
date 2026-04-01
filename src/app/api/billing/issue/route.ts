import { NextResponse } from 'next/server';
import { issueBillingKeyAction } from '@/features/billing/actions/issue-billing-key';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authKey, customerKey } = body;

    if (!authKey || !customerKey) {
      return NextResponse.json(
        { error: 'Missing authKey or customerKey' },
        { status: 400 }
      );
    }

    // 작성해둔 서버 액션 메서드를 호출하여 발급 및 DB 저장 처리를 위임
    const result = await issueBillingKeyAction({ authKey, customerKey });

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Billing key issued and saved successfully',
    });
  } catch (error: any) {
    console.error('API /billing/issue error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
