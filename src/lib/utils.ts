import { type ClassValue, clsx } from "clsx";
// import { twMerge } from "tailwind-merge";

/**
 * 클래스명 병합 유틸리티
 * tailwind-merge 설치 후 활성화
 */
export function cn(...inputs: ClassValue[]) {
  // return twMerge(clsx(inputs));
  return clsx(inputs);
}

/**
 * 가격 포맷팅
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price);
}

/**
 * 날짜 포맷팅
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/**
 * 숫자 포맷팅 (천 단위 콤마)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("ko-KR").format(num);
}
