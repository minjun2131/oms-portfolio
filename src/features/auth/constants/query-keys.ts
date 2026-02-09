/**
 * 인증 기능 Query Keys
 */
export const authQueryKeys = {
  all: ["auth"] as const,
  user: () => [...authQueryKeys.all, "user"] as const,
  session: () => [...authQueryKeys.all, "session"] as const,
};
