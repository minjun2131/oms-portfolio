import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;

  if (!NAVER_CLIENT_ID) {
    return NextResponse.json({ error: 'Missing Naver Client ID' }, { status: 500 });
  }

  // 동적으로 콜백 URL 생성 (로컬/배포 자동 구분)
  const host = request.headers.get('host') ?? 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const callbackUrl = `${protocol}://${host}/auth/naver/callback`;

  const state = Math.random().toString(36).substring(2, 15);

  const naverAuthUrl = new URL('https://nid.naver.com/oauth2.0/authorize');
  naverAuthUrl.searchParams.append('response_type', 'code');
  naverAuthUrl.searchParams.append('client_id', NAVER_CLIENT_ID);
  naverAuthUrl.searchParams.append('redirect_uri', callbackUrl);
  naverAuthUrl.searchParams.append('state', state);

  return NextResponse.redirect(naverAuthUrl.toString());
}