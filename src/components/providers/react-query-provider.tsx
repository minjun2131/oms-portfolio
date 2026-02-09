"use client";

import { ReactNode } from "react";

// React Query 설치 후 활성화
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ReactQueryProviderProps {
  children: ReactNode;
}

// const queryClient = new QueryClient();

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  // React Query 설치 후 아래 코드로 변경
  // return (
  //   <QueryClientProvider client={queryClient}>
  //     {children}
  //   </QueryClientProvider>
  // );
  
  return <>{children}</>;
}
