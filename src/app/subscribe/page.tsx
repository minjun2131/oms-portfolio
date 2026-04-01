import { createClient } from '@/lib/supabase/server';
import { PricingView } from '@/features/billing/components/PricingView';

export default async function SubscribePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // 고객 키(customerKey)로 로그인한 유저의 고유 ID를 사용. 비회원이면 null.
  const customerKey = user?.id || null;
  const customerEmail = user?.email || null;
  const customerName = user?.user_metadata?.name || user?.user_metadata?.full_name || (customerEmail ? customerEmail.split('@')[0] : null);

  return <PricingView customerKey={customerKey} customerEmail={customerEmail} customerName={customerName} />;
}
