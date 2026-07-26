"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useWallet } from "@/components/web3/WalletContext";
import { Layers, Rocket, CheckCircle2, DollarSign, TrendingUp, Droplet, RefreshCw } from "lucide-react";

export default function CollectionsDashboardPage() {
  const { address, isConnected, circleFaucetUrl, openModal } = useWallet();
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(true);

  // DB State
  const [userCollections, setUserCollections] = useState<any[]>([]);
  const [totalVolume, setTotalVolume] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  const fetchCreatorData = useCallback(async () => {
    if (!address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/user/${address}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUserCollections(data.user.collections || []);
          setTotalVolume(data.user.totalVolume || 0);
          setTotalRevenue(data.user.totalRevenue || 0);
        }
      }
    } catch (err) {
      console.error("Failed to fetch creator dashboard data from database:", err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      fetchCreatorData();
    } else {
      setLoading(false);
    }
  }, [isConnected, address, fetchCreatorData]);

  const handleClaimRoyalties = () => {
    setClaimed(true);
    setTimeout(() => setClaimed(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">
              <Layers className="h-4 w-4" /> Creator Dashboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              My Launched Collections
            </h1>
            <p className="text-sm text-slate-600">
              Manage your live NFT drops, monitor minting analytics in Circle USDC, and claim royalties.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={circleFaucetUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-blue-100 transition-all flex items-center gap-1.5"
            >
              <Droplet className="h-4 w-4 text-blue-600" /> Circle Faucet
            </a>
            <Link
              href="/launch"
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <Rocket className="h-4 w-4" /> Launch New Collection
            </Link>
          </div>
        </div>

        {!isConnected ? (
          <div className="py-20 text-center rounded-2xl border border-slate-200 bg-white p-8 space-y-4 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Connect Wallet to Access Creator Dashboard</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Please connect your Web3 wallet to manage your launched collections, view USDC revenues, and track minting history.
            </p>
            <button
              onClick={openModal}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {/* Dashboard Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Total Launched</span>
                  <Layers className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {userCollections.length}
                </div>
                <p className="text-[11px] text-slate-500">Audited ERC-721A Contracts in DB</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Gross Mint Volume</span>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-600 font-mono">
                  {totalVolume.toLocaleString()} USDC
                </div>
                <p className="text-[11px] text-slate-500">Across all active contracts</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Unclaimed Royalties</span>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-blue-600 font-mono">
                  {claimed ? "0.00 USDC" : `${totalRevenue.toLocaleString()} USDC`}
                </div>
                <div className="pt-1">
                  {claimed ? (
                    <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Royalties Claimed!
                    </span>
                  ) : (
                    <button
                      onClick={handleClaimRoyalties}
                      disabled={totalRevenue <= 0}
                      className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-100 disabled:opacity-50 transition-colors"
                    >
                      Claim Royalties (USDC)
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Collections Table / Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Active Collections Overview</h3>
                <button
                  onClick={fetchCreatorData}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh Data
                </button>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-500 font-mono">
                  Loading creator collections from database...
                </div>
              ) : userCollections.length > 0 ? (
                <div className="space-y-4">
                  {userCollections.map((col) => {
                    const progress = Math.round((col.mintedSupply / col.maxSupply) * 100);
                    return (
                      <div
                        key={col.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-300 transition-colors shadow-xs"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={col.featuredImage}
                            alt={col.name}
                            className="h-16 w-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                              {col.name} <span className="text-xs font-mono text-slate-500">({col.symbol})</span>
                            </h4>
                            <div className="text-xs text-slate-600 mt-1 flex items-center gap-3">
                              <span>Category: <strong className="text-slate-900">{col.category}</strong></span>
                              <span>Price: <strong className="text-blue-600">{col.mintPrice} USDC</strong></span>
                              <span>Royalty: <strong className="text-sky-600">{col.royaltyFee}%</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="w-36 space-y-1">
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>Minted</span>
                              <span className="text-slate-900 font-mono font-bold">{progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progress}%` }} />
                            </div>
                          </div>

                          <Link
                            href={`/explore`}
                            className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-xs"
                          >
                            View Live Page
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center rounded-2xl border border-slate-200 bg-white p-8 space-y-3 shadow-sm">
                  <h4 className="text-base font-bold text-slate-900">No collections created yet</h4>
                  <p className="text-xs text-slate-500">
                    Launch your first NFT collection on ARC Network and start earning Circle USDC primary sales & royalties.
                  </p>
                  <Link
                    href="/launch"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    <Rocket className="h-3.5 w-3.5" /> Launch Collection
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
