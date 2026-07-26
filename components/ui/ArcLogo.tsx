import React from "react";

interface ArcLogoProps {
  className?: string;
  size?: number;
}

export function ArcLogo({ className = "h-8 w-8", size }: ArcLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <defs>
        {/* Metallic Blue-Silver Gradient matching the ARC official brand logo */}
        <linearGradient id="arcLogoGradient" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#E2E8F0" />
          <stop offset="85%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
        <linearGradient id="arcBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B192C" />
          <stop offset="100%" stopColor="#1E3E62" />
        </linearGradient>
        <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2563EB" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Official ARC Curved Arch Emblem Path */}
      <path
        d="M 18.5 83.5 L 30.2 83.5 C 30.2 83.5 32.8 45.2 49.5 28.5 C 62.8 42.1 66.8 65.2 68.8 74.2 C 64.2 74.8 47.8 74.2 44.2 74.2 C 45.8 62.8 46.8 58.5 49.2 55.2 C 40.5 55.2 36.2 67.5 30.2 83.5 Z M 18.5 83.5 C 18.5 83.5 24.2 26.8 50 16.5 C 75.8 26.8 81.5 83.5 81.5 83.5 C 70.8 76.5 53.5 73.2 44.2 74.2 C 34.5 75.2 18.5 83.5 18.5 83.5 Z"
        fill="url(#arcLogoGradient)"
        filter="url(#arcGlow)"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function ArcLogoContainer({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative rounded-xl bg-gradient-to-tr from-[#091E42] via-[#172B4D] to-[#253858] p-2 flex items-center justify-center shadow-md shadow-blue-900/20 border border-blue-900/40 group-hover:scale-105 transition-transform duration-300 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="arcIconGrad" x1="15%" y1="5%" x2="85%" y2="95%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
        </defs>
        {/* Accurate ARC arch path vector */}
        <path
          d="M 18.5 83.5 L 30.2 83.5 C 30.2 83.5 32.8 45.2 49.5 28.5 C 62.8 42.1 66.8 65.2 68.8 74.2 C 64.2 74.8 47.8 74.2 44.2 74.2 C 45.8 62.8 46.8 58.5 49.2 55.2 C 40.5 55.2 36.2 67.5 30.2 83.5 Z M 18.5 83.5 C 18.5 83.5 24.2 26.8 50 16.5 C 75.8 26.8 81.5 83.5 81.5 83.5 C 70.8 76.5 53.5 73.2 44.2 74.2 C 34.5 75.2 18.5 83.5 18.5 83.5 Z"
          fill="url(#arcIconGrad)"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}
