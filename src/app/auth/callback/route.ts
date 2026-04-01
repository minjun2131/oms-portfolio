import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // 로그인 성공 시 /dashboard 로 리다이렉트
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      console.error('OAuth callback error:', error.message);
    }
  }

  // 에러 발생 시 지정된 로그인 에러 페이지로 리다이렉트
  return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
}
