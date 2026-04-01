"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function NaverLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleNaverLogin = () => {
    setIsLoading(true);
    // 직접 구현한 커스텀 네이버 OAuth 시작 라우트로 이동합니다.
    window.location.href = '/api/auth/naver';
  };

  return (
    <Button
      type="button"
      onClick={handleNaverLogin}
      disabled={isLoading}
      style={{ backgroundColor: "#03C75A", color: "white" }}
      className="w-full h-12 flex items-center justify-center transition-all hover:opacity-90 font-bold"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <svg
            className="w-4 h-4 mr-2 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
          </svg>
          네이버로 시작하기
        </>
      )}
    </Button>
  );
}
