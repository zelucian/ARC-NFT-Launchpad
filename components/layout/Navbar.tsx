"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "../web3/WalletContext";
import { ArcLogoContainer } from "../ui/ArcLogo";
import {
  Wallet,
  Menu,
  X,
  Compass,
  Rocket,
  Layers,
  HelpCircle,
} from "lucide-react";

export const Navbar = memo(function Navbar() {
  const pathname = usePathname();
  const { isConnected, formattedAddress, usdcBalance, openModal, mounted } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Optimized passive scroll handler with requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleOpenWalletModal = useCallback(() => {
    openModal();
  }, [openModal]);

  const navLinks = [
    { name: "Home", href: "/", icon: Compass },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Launch", href: "/launch", icon: Rocket },
    { name: "Collections", href: "/collections", icon: Layers },
    { name: "FAQ", href: "/faq", icon: HelpCircle },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-md shadow-blue-900/5"
          : "bg-white/80 backdrop-blur-md border-b border-slate-200/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Official ARC Brand Logo */}
        <Link href="/" prefetch={true} className="flex items-center gap-3 group">
          <ArcLogoContainer size={40} />
          <div className="flex flex-col">
            <span className="font-black text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
              ARC <span className="text-blue-600 font-bold">NFT</span>
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-medium -mt-1">
              Launchpad
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white border border-blue-200 text-blue-600 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            suppressHydrationWarning={true}
            onClick={handleOpenWalletModal}
            className={`relative group overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 flex items-center gap-2 border cursor-pointer ${
              mounted && isConnected
                ? "bg-white border-blue-200 text-slate-900 hover:border-blue-400 shadow-xs"
                : "bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 border-blue-400 text-white hover:from-blue-700 hover:to-sky-600 shadow-md shadow-blue-500/25 active:scale-[0.98]"
            }`}
          >
            <Wallet className={`h-4 w-4 ${mounted && isConnected ? "text-blue-600" : "text-white"}`} />
            {mounted && isConnected ? (
              <div className="flex items-center gap-2">
                <span>{formattedAddress}</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-mono border border-blue-200 font-bold">
                  {usdcBalance}
                </span>
              </div>
            ) : (
              <span>Connect Wallet</span>
            )}
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            suppressHydrationWarning={true}
            onClick={handleOpenWalletModal}
            className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 active:scale-95"
          >
            <Wallet className="h-5 w-5" />
          </button>
          <button
            type="button"
            suppressHydrationWarning={true}
            onClick={handleToggleMobileMenu}
            className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 active:scale-95"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-2xl px-4 py-5 space-y-4 shadow-xl">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={handleCloseMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 border border-blue-200 text-blue-600 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-5 w-5 text-blue-600" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-200">
            <button
              type="button"
              suppressHydrationWarning={true}
              onClick={() => {
                handleCloseMobileMenu();
                handleOpenWalletModal();
              }}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-[0.98]"
            >
              <Wallet className="h-4 w-4" />
              {mounted && isConnected ? `${formattedAddress} (${usdcBalance})` : "Connect Wallet"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
});
