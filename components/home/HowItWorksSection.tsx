"use client";

import React from "react";
import { motion } from "framer-motion";
import { Wallet, Layers, UploadCloud, Rocket, Sparkles } from "lucide-react";
import { MOCK_HOW_IT_WORKS } from "@/lib/mockData";

export function HowItWorksSection() {
  const iconMap: Record<string, React.ElementType> = {
    Wallet,
    Layers,
    UploadCloud,
    Rocket,
    Sparkles,
  };

  return (
    <section className="py-16 sm:py-20 relative bg-[#f1f5f9] border-y border-slate-200 overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-blue-400/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">
            <span>Seamless Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Launch your complete Web3 NFT collection on ARC Network in 5 simple no-code steps.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {/* Connector Line for desktop */}
          <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 z-0" />

          {MOCK_HOW_IT_WORKS.map((step, idx) => {
            const Icon = iconMap[step.icon] || Sparkles;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                {/* Number Badge & Glowing Node */}
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-md group-hover:border-blue-400 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <span className="absolute -bottom-2 -right-2 bg-blue-600 text-white font-mono font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-md border border-blue-400">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
