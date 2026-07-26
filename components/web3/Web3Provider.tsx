"use client";

import React, { useState, useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/web3/wagmiConfig";

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: true,
            staleTime: 1000,
            retry: 2,
          },
        },
      })
  );

  // Intercept & suppress browser extension origin authorization errors (e.g. Chrome extensions page.js)
  useEffect(() => {
    const handleExtensionError = (event: ErrorEvent | PromiseRejectionEvent) => {
      const msg =
        "reason" in event
          ? String((event as PromiseRejectionEvent).reason?.message || (event as PromiseRejectionEvent).reason)
          : (event as ErrorEvent).message || "";
      const filename = "filename" in event ? (event as ErrorEvent).filename || "" : "";

      if (
        msg.includes("has not been authorized yet") ||
        msg.includes("ethereum") ||
        filename.includes("chrome-extension") ||
        msg.includes("evmAsk.js") ||
        msg.includes("page.js")
      ) {
        if (typeof event.preventDefault === "function") {
          event.preventDefault();
        }
        if (typeof event.stopPropagation === "function") {
          event.stopPropagation();
        }
        if (typeof (event as any).stopImmediatePropagation === "function") {
          (event as any).stopImmediatePropagation();
        }
      }
    };

    window.addEventListener("error", handleExtensionError, true);
    window.addEventListener("unhandledrejection", handleExtensionError, true);

    return () => {
      window.removeEventListener("error", handleExtensionError, true);
      window.removeEventListener("unhandledrejection", handleExtensionError, true);
    };
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
