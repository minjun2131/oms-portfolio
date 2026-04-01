import { NextResponse } from 'next/server';

export async function GET() {
  const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
  const NAVER_CALLBACK_URL = process.env.NAVER_CALLBACK_URL || 'http://localhost:3000/auth/naver/callback';

  if (!NAVER_CLIENT_ID) {
    return NextResponse.json({ error: 'Missing Naver Client ID' }, { status: 500 });
  }

  // CSRF 방지를 위한 상태 토큰 생성 (여기서는 간단히 난수 사용)
  const state = Math.random().toString(36).substring(2, 15);

  const naverAuthUrl = new URL('https://nid.naver.com/oauth2.0/authorize');
  naverAuthUrl.searchParams.append('response_type', 'code');
  naverAuthUrl.searchParams.append('client_id', NAVER_CLIENT_ID);
  naverAuthUrl.searchParams.append('redirect_uri', NAVER_CALLBACK_URL);
  naverAuthUrl.searchParams.append('state', state);

  return NextResponse.redirect(naverAuthUrl.toString());
}
