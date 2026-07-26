"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MOCK_COLLECTIONS, NFTCollection } from "@/lib/mockData";
import { CenterFocusCarousel } from "../collections/CenterFocusCarousel";
import { Compass, ArrowRight, Sparkles } from "lucide-react";

export function FeaturedCollectionsSection() {
  const [collections, setCollections] = useState<NFTCollection[]>(MOCK_COLLECTIONS);

  useEffect(() => {
    async function loadDbCollections() {
      try {
        const res = await fetch("/api/collections?sortBy=Popular");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.collections) && data.collections.length > 0) {
            setCollections(data.collections);
          }
        }
      } catch (err) {
        console.error("Failed to load collections from Prisma DB:", err);
      }
    }
    loadDbCollections();
  }, []);

  return (
    <section className="py-16 sm:py-20 relative bg-[#f8fafc] text-slate-900 border-b border-slate-200 overflow-hidden">
      {/* Background Ambient Glows & Subtle Grid Pattern Overlay */}
      <div className="ambient-bg-glow top-0 left-1/4 w-96 h-96 bg-blue-400/15" />
      <div className="ambient-bg-glow bottom-0 right-1/4 w-96 h-96 bg-sky-400/15" />

      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#cbd5e1 1px, #f8fafc 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Section Header with Explore All button on the right */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="text-left space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-mono font-bold tracking-widest uppercase">
              <Compass className="h-3.5 w-3.5" /> Curated Web3 Launchpad
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight drop-shadow-sm">
              Explore Collections
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Discover NFT collections launching on ARC Network.
            </p>
          </div>

          {/* Explore All Button on the right of header */}
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95 group flex-shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Explore All</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Center Focus 3D Carousel Component */}
        <CenterFocusCarousel collections={collections} />
      </div>
    </section>
  );
}
