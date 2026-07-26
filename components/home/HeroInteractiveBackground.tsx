"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

export function HeroInteractiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Framer Motion Values for 60 FPS zero-rerender performance
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth fluid physics spring easing
  const smoothX = useSpring(mouseX, { stiffness: 280, damping: 28 });
  const smoothY = useSpring(mouseY, { stiffness: 280, damping: 28 });

  // CSS Radial Mask for crisp HD spotlight reveal of detailed metallic layer (Gambar 2)
  const maskImage = useMotionTemplate`radial-gradient(circle 260px at ${smoothX}px ${smoothY}px, black 0%, black 45%, rgba(0,0,0,0.85) 75%, transparent 100%)`;
  const webkitMaskImage = useMotionTemplate`radial-gradient(circle 260px at ${smoothX}px ${smoothY}px, black 0%, black 45%, rgba(0,0,0,0.85) 75%, transparent 100%)`;

  // Soft ambient white glow halo around spotlight
  const glowBg = useMotionTemplate`radial-gradient(circle 300px at ${smoothX}px ${smoothY}px, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.12) 50%, transparent 100%)`;

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768 || "ontouchstart" in window;
      setIsMobile(mobile);

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(rect.width / 2);
        mouseY.set(rect.height / 2);
      }
    };

    checkDevice();

    // Global Mouse Tracking across full Hero Section bounds with zero dead zones
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Calculate exact mouse coordinates relative to Hero container
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseX.set(x);
      mouseY.set(y);

      // Check if cursor is inside Hero bounds
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      setIsHovered(isInside);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove, { passive: true });
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("resize", checkDevice);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none border-0 p-0 m-0"
    >
      {/* 1. Base Layer: Gambar 1 (Full White Metallic Bas-Relief - Always Visible) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero-base-white.jpg"
          alt="ARC Hero Base Metallic Relief"
          fill
          priority
          quality={100}
          unoptimized
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            imageRendering: "crisp-edges",
            filter: "none",
            backdropFilter: "none",
          }}
        />
      </div>

      {/* 2. Top Layer: Gambar 2 (Detailed White Metallic with Highlights - Revealed only via Spotlight) */}
      <motion.div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          maskImage: isMobile
            ? "none"
            : maskImage,
          WebkitMaskImage: isMobile
            ? "none"
            : webkitMaskImage,
          opacity: isMobile ? 0 : isHovered ? 1 : 0,
          transition: "opacity 0.3s ease-out",
          filter: "none",
          backdropFilter: "none",
        }}
      >
        <Image
          src="/images/hero-highlight-white.jpg"
          alt="ARC Hero Highlight Metallic Spotlight"
          fill
          priority
          quality={100}
          unoptimized
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            imageRendering: "crisp-edges",
            filter: "none",
            backdropFilter: "none",
          }}
        />
      </motion.div>

      {/* 3. Soft Ambient White Glow Ring around spotlight cursor */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300"
          style={{
            background: glowBg,
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}
    </div>
  );
}
