"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App boundary error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-5 bg-[#f8fafc]">
      <div className="h-16 w-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
        <p className="text-xs text-slate-600">
          An error occurred while connecting to the ARC Network or rendering this view.
        </p>
      </div>

      <button
        onClick={() => reset()}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-md shadow-blue-500/20"
      >
        <RefreshCw className="h-4 w-4" /> Try Again
      </button>
    </div>
  );
}
