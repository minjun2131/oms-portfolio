import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { headers, cookies } from 'next/headers';

interface PageProps {
  searchParams: Promise<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
    code?: string;
    message?: string;
  }>;
}

export default async function SubscribeSuccessPage({ searchParams }: PageProps) {
  // Next.js 16 방식 - searchParams 비동기 처리
  const { paymentKey, orderId, amount, code, message } = await searchParams;

  // 결제 실패 시 토스페이먼츠가 에러 코드/메시지를 응답에 포함
  if (code && message) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="p-8 border rounded-lg shadow-sm bg-white max-w-md mx-auto text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">결제 실패</h2>
          <p className="text-gray-700 mb-6">{message} ({code})</p>
          <Button asChild>
            <Link href="/subscribe">다시 시도하기</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!paymentKey || !orderId || !amount) {
    redirect('/subscribe');
  }

  let result = null;
  const reqHeaders = await headers();
  const reqCookies = await cookies();
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = reqHeaders.get('host');
  const cookieHeader = reqCookies.getAll().map(c => `${c.name}=${c.value}`).join('; ');
  
  try {
    const response = await fetch(`${protocol}://${host}/api/payment/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });
    
    result = await response.json();
  } catch (err) {
    console.error('Payment confirm error:', err);
    result = { success: false, message: '결제 승인 중 오류가 발생했습니다.' };
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="p-8 border rounded-lg shadow-sm bg-white max-w-md mx-auto text-center">
        {result?.success ? (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-4">결제 성공!</h2>
            <p className="text-gray-700 mb-6">{result.message}</p>
            <Button asChild>
              <Link href="/">메인으로 이동</Link>
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-4">결제 처리 실패</h2>
            <p className="text-gray-700 mb-6">{result?.message}</p>
            <Button asChild>
              <Link href="/subscribe">다시 시도하기</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
