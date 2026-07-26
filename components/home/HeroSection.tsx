"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MOCK_CREATORS } from "@/lib/mockData";
import { HeroInteractiveBackground } from "./HeroInteractiveBackground";
import { HeroFeaturedCard } from "./HeroFeaturedCard";
import { Compass, Rocket } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex items-center pt-12 sm:pt-16 pb-20 sm:pb-28 overflow-hidden bg-[#f8fafc]">
      {/* Interactive Flashlight Spotlight Background */}
      <HeroInteractiveBackground />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none z-1"
        style={{
          backgroundImage:
            "radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#cbd5e1 1px, #f8fafc 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Seamless Bottom Gradient Transition Overlay to Explore Section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-44 sm:h-56 pointer-events-none z-5"
        style={{
          background:
            "linear-gradient(to bottom, rgba(248,250,252,0) 0%, rgba(248,250,252,0.35) 30%, rgba(248,250,252,0.75) 65%, #f8fafc 100%)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Pure Text and Action Buttons Column (No Card Container) */}
        <div className="max-w-[650px] space-y-6 text-left relative z-10">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[clamp(2.2rem,4.2vw,3.75rem)] font-black text-slate-900 tracking-tight leading-[0.98]"
          >
            Launch Your NFT Collection on{" "}
            <span className="text-gradient-accent">ARC Network</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-[20px] lg:text-[21px] text-slate-700 font-normal leading-relaxed max-w-[580px] pt-1"
          >
            Create, deploy, and manage audited Web3 NFT collections without writing smart contracts.
            Minted with Circle Testnet USDC on ARC Network.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-start gap-4 pt-2"
          >
            <Link
              href="/launch"
              className="group relative inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]"
            >
              <Rocket className="mr-2 h-4 w-4 text-white group-hover:rotate-12 transition-transform" />
              Launch Collection
            </Link>

            <Link
              href="/explore"
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold text-slate-800 transition-all duration-300 rounded-2xl border border-slate-300 bg-white/90 backdrop-blur-md hover:bg-white hover:border-slate-400 hover:text-slate-950 shadow-sm"
            >
              <Compass className="mr-2 h-4 w-4 text-slate-600" />
              Explore Collections
            </Link>
          </motion.div>

          {/* Statistics Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-7 border-t border-slate-300/80 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-[580px]"
          >
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">1.4K+</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Collections</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">489K+</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">NFTs Minted</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">24.8K+</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Active Creators</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-blue-600 font-mono">$12.4M</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">USDC Volume</div>
            </div>
          </motion.div>

          {/* Creator Avatars Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-start gap-3 pt-1"
          >
            <div className="flex -space-x-2 overflow-hidden">
              {MOCK_CREATORS.map((creator) => (
                <img
                  key={creator.id}
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover shadow-xs"
                  src={creator.avatar}
                  alt={creator.name}
                />
              ))}
            </div>
            <span className="text-[11px] text-slate-600 font-medium">
              Joined by top digital artists & Web3 studios on ARC Network
            </span>
          </motion.div>
        </div>
      </div>

      {/* Floating Featured NFT Card on Right Side (Live Database Synced) */}
      <HeroFeaturedCard />
    </section>
  );
}
