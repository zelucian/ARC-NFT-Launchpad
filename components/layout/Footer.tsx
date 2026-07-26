"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArcLogoContainer } from "../ui/ArcLogo";
import { CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";
import { WEB3_CONFIG } from "@/lib/web3/config";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="relative bg-white dark:bg-[#1A1D24] border-t border-slate-200 dark:border-slate-800 pt-16 pb-12 overflow-hidden transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 h-64 w-96 rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-64 w-96 rounded-full bg-sky-400/10 dark:bg-sky-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <ArcLogoContainer size={36} />
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                ARC <span className="text-blue-600 dark:text-blue-400 font-bold">NFT</span> Launchpad
              </span>
            </Link>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              The premier Web3 no-code NFT launchpad on ARC Network. Create, deploy, and manage
              audited ERC-721A smart contracts with Circle Testnet USDC.
            </p>

            {/* Network Status Badge */}
            <a
              href={WEB3_CONFIG.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold font-mono hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
            >
              <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              {WEB3_CONFIG.chainName} • 100% Operational
            </a>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Product</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/explore" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Explore Collections
                </Link>
              </li>
              <li>
                <Link href="/launch" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Collection Builder
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link href="/launch" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Whitelist Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Developers</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href={WEB3_CONFIG.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                >
                  ARC Explorer <ExternalLink className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href={WEB3_CONFIG.circleFaucetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                >
                  Circle USDC Faucet <ExternalLink className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://erc721a.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                >
                  ERC-721A Standard <ExternalLink className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                </a>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Smart Contract Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & FAQ Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Documentation & FAQ
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Circle Testnet USDC Guide
                </Link>
              </li>
              <li>
                <Link href="/launch" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Launch Wizard
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Platform Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Subscribe</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Get early access to exclusive collection drops.</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  suppressHydrationWarning={true}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to Newsletter"
                  suppressHydrationWarning={true}
                  className="absolute right-1 top-1 bottom-1 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="h-3 w-3" /> Subscribed successfully!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 text-center sm:text-left text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 ARC NFT Launchpad. All rights reserved. Build by Zelucian.</p>
        </div>
      </div>
    </footer>
  );
}
