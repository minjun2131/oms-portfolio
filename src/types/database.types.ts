/**
 * Supabase 데이터베이스 타입 정의
 * supabase gen types typescript 명령으로 생성
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // 테이블 타입 정의 예정
    };
    Views: {
      // 뷰 타입 정의 예정
    };
    Functions: {
      // 함수 타입 정의 예정
    };
    Enums: {
      // Enum 타입 정의 예정
    };
  };
}
