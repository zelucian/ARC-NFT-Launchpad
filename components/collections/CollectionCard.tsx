"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { NFTCollection } from "@/lib/mockData";
import { MintModal } from "../web3/MintModal";
import { ShieldCheck, Sparkles, Eye, ImageOff } from "lucide-react";

interface CollectionCardProps {
  collection: NFTCollection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const progressPercent = Math.min(
    Math.round((collection.mintedSupply / collection.maxSupply) * 100),
    100
  );

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1A1D24] shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300"
      >
        {/* Banner / Featured Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
          {!imgError ? (
            <img
              src={collection.featuredImage || collection.bannerImage}
              alt={collection.name}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex flex-col items-center justify-center text-white p-4 space-y-1">
              <ImageOff className="h-8 w-8 text-blue-200" />
              <span className="font-bold text-xs tracking-wider font-mono uppercase">{collection.symbol}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1A1D24] via-transparent to-black/20" />

          {/* Category Tag */}
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono shadow-xs">
            {collection.category}
          </span>

          {/* Status Tag */}
          <span
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono backdrop-blur-md border shadow-xs ${
              collection.status === "Live Minting"
                ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-extrabold"
                : collection.status === "Sold Out"
                ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                : "bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
            }`}
          >
            {collection.status}
          </span>
        </div>

        {/* Card Body */}
        <div className="relative p-5 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Header info */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  {collection.name}
                  {collection.isVerified && (
                    <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400 inline-block flex-shrink-0" />
                  )}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {!avatarError ? (
                    <img
                      src={collection.creatorAvatar}
                      alt={collection.creatorName}
                      onError={() => setAvatarError(true)}
                      className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[9px]">
                      {collection.creatorName[0]}
                    </div>
                  )}
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{collection.creatorName}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono font-bold">Mint Price</span>
                <div className="text-sm font-black text-blue-600 dark:text-blue-400 font-mono">
                  {collection.mintPrice} USDC
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {collection.description}
            </p>
          </div>

          {/* Mint Progress Bar */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span>Supply Minted</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold">
                  {collection.mintedSupply} / {collection.maxSupply} ({progressPercent}%)
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Action Trigger */}
            <button
              onClick={() => setIsMintModalOpen(true)}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:border-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              {collection.status === "Live Minting" ? (
                <>
                  <Sparkles className="h-3.5 w-3.5" /> Mint NFT (USDC)
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" /> View Collection
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mint Dialog */}
      <MintModal
        collection={collection}
        isOpen={isMintModalOpen}
        onClose={() => setIsMintModalOpen(false)}
      />
    </>
  );
}
