import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SettingsClient } from './client';
import { getUserById } from '@/features/users/services/get-user-by-id';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 1. 프로필 정보 
  const profile = await getUserById(supabase, user.id);

  // 2. 단건 결제 성공 기록이 있는지 확인 (status = 'DONE')
  let isSubscribed = false;
  try {
    const { data: payments } = await supabase
      .from('payments' as any)
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'DONE')
      .limit(1);

    if (payments && payments.length > 0) {
      isSubscribed = true;
    }
  } catch (error) {
    console.error('Failed to check payments:', error);
  }

  // DB의 profiles에는 fullName, phone, company, address 속성이 미존재하므로 임시값 기본 포함
  // 향후 DB 스키마 수정시 여기 동기화
  const initialProfile = {
    email: profile?.email || user.email || '',
    fullName: profile?.email ? profile.email.split('@')[0] : 'Admin User',
    phone: '010-0000-0000',
    company: '셀러플로우',
    address: '서울특별시 강남구',
  };

  async function handleLogout() {
    'use server';
    const s = await createClient();
    await s.auth.signOut();
    redirect('/login');
  }

  return (
    <SettingsClient 
      initialProfile={initialProfile} 
      isSubscribed={isSubscribed} 
      onLogout={handleLogout}
    />
  );
}
