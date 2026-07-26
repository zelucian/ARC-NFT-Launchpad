"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, Sparkles, ShieldCheck } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 sm:py-20 relative bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-blue-400/30 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 p-10 sm:p-16 text-center shadow-2xl shadow-blue-500/25 text-white"
        >
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/30 bg-white/10 text-white text-xs font-semibold font-mono backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-sky-200" />
              <span>Deploy on ARC Testnet or Mainnet in Minutes</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to Launch Your NFT Collection?
            </h2>

            <p className="text-sm sm:text-lg text-blue-100 font-normal leading-relaxed">
              Join thousands of digital creators, Web3 studios, and brands building on ARC Network.
              Zero coding required. Instant IPFS deployment.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/launch"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-blue-700 font-extrabold text-base shadow-xl hover:bg-blue-50 hover:scale-105 transition-all"
              >
                <Rocket className="h-5 w-5 text-blue-600" />
                Launch Now
              </Link>
            </div>

            <div className="pt-4 flex items-center justify-center gap-6 text-xs text-blue-100">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-300" /> Audited ERC-721A
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-sky-300" /> 0% Protocol Fee
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-white" /> Automated IPFS
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
