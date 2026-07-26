import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-[#f8fafc]">
      <div className="relative h-16 w-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
      <p className="text-xs font-mono font-bold text-slate-600 tracking-wider uppercase">
        Connecting to ARC Network...
      </p>
    </div>
  );
}
