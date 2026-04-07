import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { queryClient } from "@/api/queryClient";
import { RootLayout } from "@/layouts/RootLayout";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayout />
      <Toaster position="bottom-right" theme="dark" richColors closeButton />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
