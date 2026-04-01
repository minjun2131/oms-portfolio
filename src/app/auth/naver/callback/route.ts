import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

// 토큰 발급 및 유저 정보 조회
async function getNaverUserParams(code: string, state: string) {
  const CLIENT_ID = process.env.NAVER_CLIENT_ID!;
  const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET!;

  const tokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}&state=${state}`;

  const tokenResponse = await fetch(tokenUrl, { method: 'GET' });
  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    throw new Error('Failed to get naver access token');
  }

  const userResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userResponse.json();

  if (userData.resultcode !== '00') {
    throw new Error('Failed to get naver user info');
  }

  return userData.response; // { email, name, profile_image, id }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state');

  if (!code || !state) {
    return NextResponse.redirect(new URL('/login?error=missing_code_or_state', request.url));
  }

  try {
    // 1. 네이버 토큰 및 유저 정보 획득
    const naverUser = await getNaverUserParams(code, state);
    const email = naverUser.email;
    const name = naverUser.name || 'Naver User';
    const avatar = naverUser.profile_image || '';

    if (!email) {
      throw new Error('No email found in Naver profile');
    }

    // 2. 관리자 클라이언트 준비 (DB CRUD 및 Magic Link 생성용)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. 기존 유저 확인 및 신규 생성
    // admin.createUser는 이미 존재하는 경우 에러를 던지지 않고 무시 혹은 에러를 반환합니다.
    const { error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        avatar_url: avatar,
        custom_provider: 'naver',
      },
    });
    
    // Auth already exists 에러가 발생해도 매직링크 생성을 통해 로그인 시킬 수 있으므로 무시합니다.
    if (createError && !createError.message.includes('already exists')) {
      console.error('Failed to create user:', createError);
      throw createError;
    }

    // 4. 매직링크 생성 (로그인 우회용 일회성 토큰 획득)
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });

    if (linkError || !linkData?.properties?.hashed_token) {
      throw new Error('Failed to generate magic link token');
    }

    // 5. 서버 클라이언트로 토큰 해시 검증하여 세션 생성 (쿠키로 저장됨)
    const serverClient = await createServerClient();
    const { error: verifyError } = await serverClient.auth.verifyOtp({
      type: 'magiclink',
      token_hash: linkData.properties.hashed_token,
    });

    if (verifyError) {
      throw verifyError;
    }

    // 6. 성공 시 메인 홈페이지(/)로 이동
    return NextResponse.redirect(new URL('/', request.url));

  } catch (error: any) {
    console.error('Naver callback processing error:', error);
    return NextResponse.redirect(new URL(`/login?error=auth_failed`, request.url));
  }
}
