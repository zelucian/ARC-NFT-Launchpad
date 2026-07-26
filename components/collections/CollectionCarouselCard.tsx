"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { NFTCollection } from "@/lib/mockData";
import { MintModal } from "../web3/MintModal";
import { ShieldCheck, Sparkles, ImageOff } from "lucide-react";

interface CollectionCarouselCardProps {
  collection: NFTCollection;
}

export function CollectionCarouselCard({ collection }: CollectionCarouselCardProps) {
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const progressPercent = Math.min(
    Math.round((collection.mintedSupply / collection.maxSupply) * 100),
    100
  );

  // Status Badge Colors per Specification:
  // Live -> Green, Upcoming -> Blue, Sold Out -> Red, Ended -> Gray
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Live Minting":
        return "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 font-black";
      case "Upcoming":
        return "bg-blue-500/20 border-blue-500/50 text-blue-400 font-bold";
      case "Sold Out":
        return "bg-red-500/20 border-red-500/50 text-red-400 font-bold";
      case "Ended":
      default:
        return "bg-slate-500/20 border-slate-500/50 text-slate-400 font-bold";
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={() => setIsMintModalOpen(true)}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl w-[230px] sm:w-[250px] md:w-[260px] h-[390px] sm:h-[410px] shadow-xl hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer transition-all duration-300 flex-shrink-0 select-none"
      >
        {/* Ambient Hover Glow overlay */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300 pointer-events-none" />

        {/* Top 72% Image Area */}
        <div className="relative h-[275px] sm:h-[290px] w-full overflow-hidden bg-slate-900 flex items-center justify-center">
          {!imgError ? (
            <img
              src={collection.featuredImage || collection.bannerImage}
              alt={collection.name}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center text-white p-4 space-y-2">
              <ImageOff className="h-8 w-8 text-blue-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">{collection.symbol}</span>
            </div>
          )}

          {/* Bottom-to-top Dark Gradient Overlay for optimal text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-90" />

          {/* Status Badge - Top Left */}
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-mono border backdrop-blur-md shadow-md ${getStatusBadge(collection.status)}`}>
              {collection.status}
            </span>
          </div>

          {/* Verified Badge - Top Right */}
          {collection.isVerified && (
            <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-slate-950/80 backdrop-blur-md border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-md">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          )}

          {/* Essential Overlay Info at Bottom of Image */}
          <div className="absolute bottom-2 left-3 right-3 space-y-0.5">
            <h3 className="text-base font-black text-white tracking-tight truncate group-hover:text-sky-300 transition-colors">
              {collection.name}
            </h3>
            <p className="text-xs text-slate-400 font-medium truncate">
              by <span className="text-slate-200 font-semibold">{collection.creatorName}</span>
            </p>
          </div>
        </div>

        {/* Bottom Card Content Info Area (28% Height) */}
        <div className="relative p-3.5 flex-1 flex flex-col justify-between bg-slate-950/90 text-white border-t border-slate-800/80 space-y-2">
          {/* Progress Bar Area */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">{collection.mintedSupply} / {collection.maxSupply}</span>
              <span className="text-slate-200 font-bold">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Bottom Bar: Price & Action Trigger */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-900">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
              <Sparkles className="h-3 w-3 text-sky-400" />
              <span>Mint</span>
            </div>
            <div className="text-sm font-black font-mono text-sky-400 tracking-tight">
              {collection.mintPrice} USDC
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mint Modal Trigger */}
      <MintModal
        collection={collection}
        isOpen={isMintModalOpen}
        onClose={() => setIsMintModalOpen(false)}
      />
    </>
  );
}
