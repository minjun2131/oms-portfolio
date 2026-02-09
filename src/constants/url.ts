/**
 * URL 상수 정의
 */

export const API_URL = {
  BASE: process.env.NEXT_PUBLIC_API_URL || "",
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
  },
  PRODUCTS: "/products",
  ORDERS: "/orders",
  CUSTOMERS: "/customers",
  INVENTORY: "/inventory",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PRODUCTS: "/products",
  ORDERS: "/orders",
  CUSTOMERS: "/customers",
  INVENTORY: "/inventory",
  ANALYTICS: "/analytics",
  SETTINGS: "/settings",
} as const;
