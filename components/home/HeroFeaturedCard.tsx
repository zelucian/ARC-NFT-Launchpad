"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MOCK_COLLECTIONS, NFTCollection } from "@/lib/mockData";
import { useWallet } from "../web3/WalletContext";
import { MintModal } from "../web3/MintModal";
import { Sparkles, ShieldCheck, Flame, ChevronRight } from "lucide-react";

export function HeroFeaturedCard() {
  const [collection, setCollection] = useState<NFTCollection>(MOCK_COLLECTIONS[0]);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const { isConnected } = useWallet();

  // Motion values for smooth cursor parallax tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [3, -3]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-3, 3]), { stiffness: 200, damping: 20 });

  useEffect(() => {
    async function loadFeaturedCollection() {
      try {
        const res = await fetch("/api/collections?sortBy=Popular");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.collections) && data.collections.length > 0) {
            // Pick ARC Cyber Chronos or top featured collection from Prisma DB
            const chronos = data.collections.find((c: NFTCollection) => c.symbol === "CHRONOS") || data.collections[0];
            setCollection(chronos);
          }
        }
      } catch (err) {
        console.error("Failed to load featured Hero collection from DB:", err);
      }
    }

    loadFeaturedCollection();

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const percentage = Math.min(
    100,
    Math.round((collection.mintedSupply / (collection.maxSupply || 1)) * 100)
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{
          opacity: 1,
          y: [0, -8, 0],
          scale: 1,
        }}
        transition={{
          opacity: { duration: 0.8, delay: 0.4 },
          scale: { duration: 0.8, delay: 0.4 },
          y: {
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
        }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{
          scale: 1.03,
          boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.25)",
        }}
        className="hidden lg:block absolute right-6 sm:right-12 lg:right-16 bottom-16 z-20 w-[340px] rounded-3xl border border-white/60 bg-white/15 p-4 shadow-2xl backdrop-blur-2xl transition-all duration-300 text-slate-900 group"
      >
        {/* Header Badge */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/40 border border-emerald-200/50 text-emerald-800 text-[11px] font-mono font-bold backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {collection.status}
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-blue-600 bg-blue-50/40 px-2.5 py-1 rounded-full border border-blue-200/50 backdrop-blur-md">
            <Flame className="h-3 w-3 text-blue-500" /> Trending #1
          </div>
        </div>

        {/* Collection Cover Thumbnail Image */}
        <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-3 border border-white/50 shadow-inner group-hover:scale-[1.01] transition-transform duration-300">
          <img
            src={collection.featuredImage || collection.bannerImage}
            alt={collection.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
            <span className="text-[11px] font-mono font-bold bg-slate-900/80 px-2 py-0.5 rounded-md backdrop-blur-md">
              {collection.symbol}
            </span>
            <span className="text-xs font-mono font-bold text-blue-300 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" /> Audited
            </span>
          </div>
        </div>

        {/* Collection Title & Creator */}
        <div className="space-y-1 mb-3 text-left">
          <h4 className="text-base font-black text-slate-900 tracking-tight flex items-center justify-between">
            <span className="truncate">{collection.name}</span>
            <Sparkles className="h-4 w-4 text-blue-500 flex-shrink-0" />
          </h4>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <img
              src={collection.creatorAvatar}
              alt={collection.creatorName}
              className="h-4 w-4 rounded-full object-cover ring-1 ring-slate-200"
            />
            <span className="font-medium text-slate-700">{collection.creatorName}</span>
          </div>
        </div>

        {/* Price & Mint Progress */}
        <div className="rounded-xl bg-white/15 border border-white/40 backdrop-blur-md p-3 space-y-2 text-left mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Mint Price</span>
            <span className="font-mono font-bold text-blue-600 text-sm">
              {collection.mintPrice} USDC
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-600">
              <span>Progress</span>
              <span className="font-bold text-slate-900">{percentage}% ({collection.mintedSupply}/{collection.maxSupply})</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-300/40 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: 0.6 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsMintModalOpen(true)}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-1 group/btn"
        >
          <span>Mint {collection.name}</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </motion.div>

      {/* Mint Modal Trigger */}
      {isMintModalOpen && (
        <MintModal
          collection={collection}
          isOpen={isMintModalOpen}
          onClose={() => setIsMintModalOpen(false)}
        />
      )}
    </>
  );
}
