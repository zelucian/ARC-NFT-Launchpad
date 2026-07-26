"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NFTCollection } from "@/lib/mockData";
import { MintModal } from "../web3/MintModal";
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles, ImageOff } from "lucide-react";

interface CenterFocusCarouselProps {
  collections: NFTCollection[];
}

export function CenterFocusCarousel({ collections }: CenterFocusCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCollection, setSelectedCollection] = useState<NFTCollection | null>(null);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [imgErrors, setImgErrors] = useState<{ [key: string]: boolean }>({});
  
  // Autoplay & Interaction State
  const [isHovered, setIsHovered] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!collections || collections.length === 0) return null;

  const total = collections.length;

  // Triggered when user manually clicks Next, Prev, Card, or Indicator Dots
  const triggerUserInteraction = () => {
    setIsUserInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    // Resume autoplay after 5 seconds of inactivity
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 5000);
  };

  const handleNext = () => {
    triggerUserInteraction();
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    triggerUserInteraction();
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleCardClick = (col: NFTCollection, isCenter: boolean) => {
    triggerUserInteraction();
    if (isCenter) {
      setSelectedCollection(col);
      setIsMintModalOpen(true);
    } else {
      const clickedIdx = collections.findIndex((c) => c.id === col.id);
      if (clickedIdx !== -1) {
        setActiveIndex(clickedIdx);
      }
    }
  };

  // Autoplay Effect (3.5s interval, 60fps spring transitions, auto-pauses on hover/interaction)
  useEffect(() => {
    if (isHovered || isUserInteracting || isMintModalOpen) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered, isUserInteracting, isMintModalOpen, total]);

  // Clean up interaction timer on unmount
  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  // Status Badge Colors (Live -> Green, Upcoming -> Blue, Sold Out -> Red, Ended -> Gray)
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Live Minting":
        return "bg-emerald-100 border-emerald-300 text-emerald-800 font-black";
      case "Upcoming":
        return "bg-blue-100 border-blue-300 text-blue-800 font-bold";
      case "Sold Out":
        return "bg-red-100 border-red-300 text-red-800 font-bold";
      case "Ended":
      default:
        return "bg-slate-100 border-slate-300 text-slate-700 font-bold";
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full overflow-hidden py-10"
    >
      {/* Navigation Buttons */}
      <div className="absolute top-1/2 left-2 sm:left-6 z-40 -translate-y-1/2">
        <button
          onClick={handlePrev}
          type="button"
          aria-label="Previous Collection"
          className="h-12 w-12 rounded-full border border-slate-200 bg-white/90 text-slate-800 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 shadow-xl backdrop-blur-md flex items-center justify-center active:scale-90"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>

      <div className="absolute top-1/2 right-2 sm:right-6 z-40 -translate-y-1/2">
        <button
          onClick={handleNext}
          type="button"
          aria-label="Next Collection"
          className="h-12 w-12 rounded-full border border-slate-200 bg-white/90 text-slate-800 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 shadow-xl backdrop-blur-md flex items-center justify-center active:scale-90"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* 3D Center Focus Carousel Track */}
      <div className="relative h-[430px] sm:h-[450px] w-full flex items-center justify-center perspective-1000">
        <AnimatePresence initial={false}>
          {collections.map((col, index) => {
            // Compute shortest distance around circular list for infinite loop
            let offset = index - activeIndex;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isCenter = offset === 0;
            const absOffset = Math.abs(offset);

            // Hide cards beyond 2 positions from center for clean 60fps performance
            if (absOffset > 2) return null;

            // Scale & Position Mapping
            // Active Center Card: scale(1.0), translateY(-15px), opacity 100%, zIndex 30
            // Immediate Neighbors (offset +/- 1): scale(0.88), translateY(0), opacity 85%, zIndex 20
            // Outer Neighbors (offset +/- 2): scale(0.75), translateY(0), opacity 55%, zIndex 10
            const scale = isCenter ? 1.0 : absOffset === 1 ? 0.88 : 0.75;
            const translateY = isCenter ? -15 : 0;
            const opacity = isCenter ? 1.0 : absOffset === 1 ? 0.85 : 0.55;
            const zIndex = isCenter ? 30 : 30 - absOffset * 10;
            const translateX = offset * 220; // 220px horizontal offset per step

            const progressPercent = Math.min(
              Math.round((col.mintedSupply / col.maxSupply) * 100),
              100
            );

            return (
              <motion.div
                key={col.id}
                onClick={() => handleCardClick(col, isCenter)}
                initial={{
                  scale,
                  x: translateX,
                  y: translateY,
                  opacity,
                }}
                animate={{
                  scale,
                  x: translateX,
                  y: translateY,
                  opacity,
                  zIndex,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 24,
                  mass: 0.8,
                }}
                style={{
                  willChange: "transform, opacity",
                  position: "absolute",
                }}
                className={`w-[230px] sm:w-[250px] md:w-[260px] h-[390px] sm:h-[410px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 select-none ${
                  isCenter
                    ? "border-2 border-blue-500 bg-white shadow-2xl shadow-blue-500/25 ring-4 ring-blue-500/10"
                    : "border border-slate-200 bg-white/90 shadow-md hover:border-blue-300"
                }`}
              >
                {/* Image Focus (70-75% Height) */}
                <div className="relative h-[275px] sm:h-[290px] w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                  {!imgErrors[col.id] ? (
                    <img
                      src={col.featuredImage || col.bannerImage}
                      alt={col.name}
                      onError={() =>
                        setImgErrors((prev) => ({ ...prev, [col.id]: true }))
                      }
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex flex-col items-center justify-center text-white p-4 space-y-1">
                      <ImageOff className="h-8 w-8 text-blue-200" />
                      <span className="font-bold text-xs font-mono uppercase">{col.symbol}</span>
                    </div>
                  )}

                  {/* Gradient Overlay for Crisp Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                  {/* Status Badge - Top Left */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-mono border backdrop-blur-md shadow-xs ${getStatusBadge(
                        col.status
                      )}`}
                    >
                      {col.status}
                    </span>
                  </div>

                  {/* Verified Icon - Top Right */}
                  {col.isVerified && (
                    <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-white/90 backdrop-blur-md border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                  )}

                  {/* Essential Name & Creator Overlay at Image Bottom */}
                  <div className="absolute bottom-2.5 left-3 right-3 space-y-0.5 text-white">
                    <h3 className="text-base font-black tracking-tight truncate drop-shadow-sm">
                      {col.name}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium truncate">
                      by <span className="text-white font-semibold">{col.creatorName}</span>
                    </p>
                  </div>
                </div>

                {/* Bottom Content Area */}
                <div className="p-3.5 flex flex-col justify-between h-[115px] sm:h-[120px] bg-white text-slate-900 border-t border-slate-100 space-y-2">
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500 font-semibold">
                        {col.mintedSupply} / {col.maxSupply}
                      </span>
                      <span className="text-blue-600 font-bold">
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Bottom Bar: Action & Price */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                      <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                      <span>{isCenter ? "Click to Mint" : "Select"}</span>
                    </div>
                    <div className="text-sm font-black font-mono text-blue-600">
                      {col.mintPrice} USDC
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Slide Indicators / Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-4">
        {collections.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              triggerUserInteraction();
              setActiveIndex(idx);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === activeIndex
                ? "w-8 bg-blue-600 shadow-md shadow-blue-500/30"
                : "w-2 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>

      {/* Mint Modal Trigger */}
      <MintModal
        collection={selectedCollection}
        isOpen={isMintModalOpen}
        onClose={() => setIsMintModalOpen(false)}
      />
    </div>
  );
}
