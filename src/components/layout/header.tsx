import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getUserProfile } from "@/features/users/services/users.service";

export async function Header() {
  // 3단계 사용 계층: Service 함수를 호출해 유저 정보를 가져옵니다 (서버 컴포넌트)
  // 실제 서비스라면 로그인 사용자의 세션 ID(user.id)를 넣겠지만, 테스트용으로 직접 Mock ID를 주입합니다.
  const profile = await getUserProfile("550e8400-e29b-41d4-a716-446655440000");

  return (
    <header className="sticky top-0 z-20 hidden border-b border-border bg-card/80 backdrop-blur-sm lg:block">
      <div className="flex h-16 items-center justify-between px-8">
        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="상품, 주문, 고객 검색..."
            className="h-10 w-full pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary p-0 text-[10px] text-primary-foreground flex items-center justify-center">
              3
            </Badge>
          </Button>
          <div className="h-8 w-px bg-border" />
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">오늘의 매출</p>
            <p className="text-lg font-semibold text-primary">₩1,280,000</p>
          </div>
          
          {/* Supabase DB에서 가져온 유저 정보 표시 영역 */}
          {profile && (
            <>
              <div className="h-8 w-px bg-border ml-3" />
              <div className="flex items-center gap-3 ml-3">
                {profile.avatar_url && (
                  <img 
                    src={profile.avatar_url} 
                    alt="User Avatar" 
                    className="h-9 w-9 rounded-full border border-border bg-muted object-cover" 
                  />
                )}
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">{profile.email}</p>
                  <p className="text-xs text-muted-foreground">Admin Account</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
