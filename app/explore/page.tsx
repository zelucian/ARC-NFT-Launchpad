"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_COLLECTIONS, NFTCollection } from "@/lib/mockData";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { Search, Compass, Filter, ArrowUpDown, Sparkles, RefreshCw, Loader2 } from "lucide-react";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Popular");
  const [displayLimit, setDisplayLimit] = useState(8);

  // Database State
  const [collections, setCollections] = useState<NFTCollection[]>(MOCK_COLLECTIONS);
  const [loading, setLoading] = useState<boolean>(true);

  const categories = ["All", "Art", "Gaming", "Music", "PFP", "Utility", "RWA"];
  const statuses = ["All", "Live Minting", "Upcoming", "Sold Out", "Ended"];
  const sortOptions = [
    { label: "Popular", value: "Popular" },
    { label: "Newest", value: "Newest" },
    { label: "Mint Price: Low to High", value: "PriceAsc" },
    { label: "Mint Price: High to Low", value: "PriceDesc" },
    { label: "Max Supply", value: "Supply" },
    { label: "Alphabetical (A-Z)", value: "Alphabetical" },
  ];

  // Fetch collections from Prisma Database via /api/collections
  const fetchDbCollections = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (selectedStatus !== "All") params.append("status", selectedStatus);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      if (sortBy) params.append("sortBy", sortBy);

      const res = await fetch(`/api/collections?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.collections)) {
          setCollections(data.collections);
        }
      }
    } catch (err) {
      console.error("Failed to query collections from database:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, searchQuery, sortBy]);

  useEffect(() => {
    fetchDbCollections();
  }, [fetchDbCollections]);

  const visibleCollections = collections.slice(0, displayLimit);
  const hasMore = displayLimit < collections.length;

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + 4);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedStatus("All");
    setSortBy("Popular");
    setDisplayLimit(8);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="ambient-bg-glow top-10 left-10 w-96 h-96 bg-blue-400/15" />
      <div className="ambient-bg-glow top-40 right-10 w-96 h-96 bg-sky-400/15" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#cbd5e1 1px, #f8fafc 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-mono font-bold tracking-widest uppercase">
              <Compass className="h-4 w-4 text-blue-600" />
              <span>ARC Network Database Directory</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Explore Collections
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl">
              Discover all NFT collections available on ARC Network.
            </p>
          </div>

          {/* Search Bar (Top-Right) */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayLimit(8);
              }}
              placeholder="Search Collection, Creator, Category..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>
        </div>

        {/* Filter & Sort Controls Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-500 font-mono font-bold mr-1 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-blue-600" /> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setDisplayLimit(8);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Right Controls: Status & Sort Select */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Select */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                {statuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setSelectedStatus(st);
                      setDisplayLimit(8);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedStatus === st
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                <ArrowUpDown className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-slate-500 font-semibold">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Directory Count Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>
            Showing <strong className="text-blue-600">{visibleCollections.length}</strong> of{" "}
            <strong className="text-slate-900">{collections.length}</strong> NFT collections from Database
          </span>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"
          >
            <RefreshCw className="h-3 w-3" /> Reset Filters
          </button>
        </div>

        {/* Responsive Grid Layout (Desktop: 4, Laptop: 3, Tablet: 2, Mobile: 1) */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-mono">Querying Prisma PostgreSQL database...</p>
          </div>
        ) : visibleCollections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {visibleCollections.map((col, idx) => (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                >
                  <CollectionCard collection={col} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-20 text-center rounded-2xl border border-slate-200 bg-white p-8 space-y-4 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <Search className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">No collections found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any database record matching your search or active filter criteria.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" /> Show All Collections
            </button>
          </div>
        )}

        {/* Load More Pagination */}
        {hasMore && (
          <div className="text-center pt-6 pb-8">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold text-xs hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 shadow-sm active:scale-95 inline-flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Load More Collections ({collections.length - displayLimit} remaining)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
