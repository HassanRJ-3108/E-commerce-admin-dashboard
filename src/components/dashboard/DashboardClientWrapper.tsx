"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function DashboardClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Client-side pe QueryClient instance initialize karna
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
