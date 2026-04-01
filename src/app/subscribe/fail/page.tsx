import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{
    code?: string;
    message?: string;
  }>;
}

export default async function SubscribeFailPage({ searchParams }: PageProps) {
  const { code, message } = await searchParams;

  if (!code && !message) {
    redirect('/subscribe');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="p-8 border rounded-lg shadow-sm bg-white max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">카드 등록 실패</h2>
        <p className="text-gray-700 mb-6">{message} ({code})</p>
        <Button asChild>
          <Link href="/subscribe">다시 시도하기</Link>
        </Button>
      </div>
    </div>
  );
}
