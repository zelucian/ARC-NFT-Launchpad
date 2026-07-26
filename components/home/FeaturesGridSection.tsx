"use client";

import React from "react";
import { motion } from "framer-motion";
import { Wand2, Cpu, Database, ShieldCheck, BarChart3, Users } from "lucide-react";
import { MOCK_FEATURES } from "@/lib/mockData";

export function FeaturesGridSection() {
  const iconMap: Record<string, React.ElementType> = {
    Wand2,
    Cpu,
    Database,
    ShieldCheck,
    BarChart3,
    Users,
  };

  return (
    <section className="py-16 sm:py-20 relative bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">
            <span>Built for Creators & Collectors</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Built for Modern Web3 Launches
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Everything you need to launch, scale, and monetize your digital assets on ARC Network.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_FEATURES.map((feature, idx) => {
            const Icon = iconMap[feature.icon] || Wand2;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 hover:border-blue-300 hover:shadow-xl transition-all duration-300 shadow-sm"
              >
                {/* Background glow gradient */}
                <div
                  className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`}
                />

                <div className="relative z-10 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
                    <Icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
