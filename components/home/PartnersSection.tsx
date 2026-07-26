"use client";

import React from "react";
import { motion } from "framer-motion";
import { Hexagon, Shield, Zap, HardDrive, Cloud } from "lucide-react";

export function PartnersSection() {
  const partners = [
    { name: "ARC Network", tag: "Layer 2 Infra", icon: Hexagon, color: "group-hover:text-blue-600" },
    { name: "MetaMask", tag: "Web3 Provider", icon: Shield, color: "group-hover:text-amber-500" },
    { name: "WalletConnect", tag: "Protocol", icon: Zap, color: "group-hover:text-blue-500" },
    { name: "IPFS", tag: "Storage Network", icon: HardDrive, color: "group-hover:text-sky-500" },
    { name: "Pinata", tag: "Decentralized Pinning", icon: Cloud, color: "group-hover:text-indigo-600" },
  ];

  return (
    <section className="py-12 border-y border-slate-200 bg-slate-100/60 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-8">
          POWERING THE FUTURE OF DIGITAL OWNERSHIP WITH LEADING WEB3 INFRASTRUCTURE
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-center">
          {partners.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-6 w-6 text-slate-400 grayscale group-hover:grayscale-0 transition-all duration-300 ${partner.color}`}
                  />
                  <span className="font-extrabold text-sm text-slate-700 group-hover:text-slate-900 transition-colors duration-300">
                    {partner.name}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-1 group-hover:text-blue-600 transition-colors">
                  {partner.tag}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
