import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// Configure QueryClient with optimized settings for Pokemon data
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Pokemon data rarely changes - keep stale for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 30 minutes
      gcTime: 30 * 60 * 1000,
      // Don't refetch on window focus for static data
      refetchOnWindowFocus: false,
      // Retry failed requests up to 2 times
      retry: 2,
      // Don't refetch when component remounts
      refetchOnMount: false,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export { queryClient };
