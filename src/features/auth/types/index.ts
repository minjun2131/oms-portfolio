/**
 * 인증 UI 타입 정의
 */

export interface User {
  id: string;
  email: string;
  name: string;
  shopName: string;
  createdAt: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  shopName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
