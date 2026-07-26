"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/components/web3/WalletContext";
import {
  Rocket,
  CheckCircle2,
  UploadCloud,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  FileText,
  X,
  Sparkles,
} from "lucide-react";

export default function LaunchWizardPage() {
  const { isConnected, address, openModal } = useWallet();

  const [step, setStep] = useState<number>(1);

  // File Input Refs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const archiveInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "ARC Cyber Samurai",
    symbol: "SAMURAI",
    description: "An exclusive collection of 2,222 Cybernetically enhanced Samurais guarding the ARC Core.",
    category: "PFP",
    royalty: 5.0,
    bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80",
    mintPrice: 15,
    maxSupply: 2222,
    maxPerWallet: 5,
    startDate: "2026-08-01T12:00",
    enableWhitelist: true,
  });

  // Uploaded Files State
  const [coverFileName, setCoverFileName] = useState<string | null>(null);
  const [bannerFileName, setBannerFileName] = useState<string | null>(null);
  const [archiveFileName, setArchiveFileName] = useState<string | null>(null);
  const [archiveFileSize, setArchiveFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Deployment Logs & API State
  const [deploying, setDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [deployedContract, setDeployedContract] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);

  const stepsList = [
    { num: 1, title: "General Info" },
    { num: 2, title: "Media & IPFS" },
    { num: 3, title: "Mint Pricing" },
    { num: 4, title: "Deploy Smart Contract" },
  ];

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  // Handle Cover Image Upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({ ...prev, coverUrl: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Banner Image Upload
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({ ...prev, bannerUrl: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle ZIP Archive Dropzone Upload
  const handleArchiveFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setArchiveFileName(file.name);
      setArchiveFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleArchiveFileSelect(e.dataTransfer.files);
  };

  const startDeployment = async () => {
    if (!isConnected || !address) {
      openModal();
      return;
    }

    setDeploying(true);
    setDeployStep(1);
    setDeployError(null);

    try {
      // Step 1: Compile ERC-721A
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDeployStep(2);

      // Step 2: Pin to IPFS
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDeployStep(3);

      // Step 3: Call Database API to Create Collection
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          symbol: formData.symbol,
          description: formData.description,
          category: formData.category,
          mintPrice: formData.mintPrice,
          maxSupply: formData.maxSupply,
          royaltyFee: formData.royalty,
          bannerImage: formData.bannerUrl,
          featuredImage: formData.coverUrl,
          creatorAddress: address,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to persist collection into Database");
      }

      setDeployedContract(data.collection.contractAddress);
      setDeployStep(4);
    } catch (err: any) {
      console.error("Collection deployment error:", err);
      setDeployError(err.message || "Failed to deploy collection smart contract");
      setDeployStep(0);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-mono font-bold">
            <Rocket className="h-3.5 w-3.5" /> No-Code Collection Builder
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Launch Your NFT Collection
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Fill in your collection specs, upload media to IPFS, and deploy an audited ERC-721A smart contract for Circle USDC minting.
          </p>
        </div>

        {/* Step Progress Tracker */}
        <div className="flex items-center justify-between border-y border-slate-200 py-4 px-2 bg-white rounded-2xl shadow-xs">
          {stepsList.map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all ${
                  step > s.num
                    ? "bg-emerald-500 text-white"
                    : step === s.num
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : "bg-slate-100 text-slate-400 border border-slate-200"
                }`}
              >
                {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : s.num}
              </div>
              <span
                className={`hidden sm:inline text-xs font-medium ${
                  step === s.num ? "text-slate-900 font-bold" : "text-slate-500"
                }`}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Wizard Form Panels */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl relative text-slate-900">
          <AnimatePresence mode="wait">
            {/* Step 1: General Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
                  Step 1: Collection Metadata
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Collection Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. ARC Cyber Samurai"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Token Symbol *</label>
                    <input
                      type="text"
                      value={formData.symbol}
                      onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                      placeholder="e.g. SAMURAI"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-mono uppercase focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your collection background, vision, and holder utilities..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    >
                      <option value="PFP">PFP Avatar</option>
                      <option value="Art">Digital Art</option>
                      <option value="Gaming">Web3 Gaming</option>
                      <option value="Music">Audio & Music</option>
                      <option value="RWA">Real World Asset</option>
                      <option value="Utility">Utility Pass</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Creator Royalty Fee (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="10"
                      value={formData.royalty}
                      onChange={(e) => setFormData({ ...formData, royalty: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Media & Artwork (Fixed with real interactive file upload) */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
                  Step 2: Media Assets & IPFS Storage
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cover Image Upload Card */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span>Featured Cover Image (Card / PFP) *</span>
                      {coverFileName && <span className="text-emerald-600 font-mono text-[10px]">✓ Uploaded</span>}
                    </label>

                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />

                    <div
                      onClick={() => coverInputRef.current?.click()}
                      className="relative h-44 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center p-4 cursor-pointer group overflow-hidden"
                    >
                      {formData.coverUrl ? (
                        <div className="relative w-full h-full">
                          <img
                            src={formData.coverUrl}
                            alt="Cover Preview"
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-bold gap-1">
                            <ImageIcon className="h-4 w-4" /> Change Image
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900">Click to upload Cover</span>
                            <p className="text-[11px] text-slate-500 mt-0.5">PNG, JPG, WEBP, GIF up to 10MB</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Banner Image Upload Card */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span>Collection Banner Image *</span>
                      {bannerFileName && <span className="text-emerald-600 font-mono text-[10px]">✓ Uploaded</span>}
                    </label>

                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      className="hidden"
                    />

                    <div
                      onClick={() => bannerInputRef.current?.click()}
                      className="relative h-44 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center p-4 cursor-pointer group overflow-hidden"
                    >
                      {formData.bannerUrl ? (
                        <div className="relative w-full h-full">
                          <img
                            src={formData.bannerUrl}
                            alt="Banner Preview"
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-bold gap-1">
                            <ImageIcon className="h-4 w-4" /> Change Banner
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900">Click to upload Banner</span>
                            <p className="text-[11px] text-slate-500 mt-0.5">Wide aspect ratio (1200x400 recommended)</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Batch ZIP Drag and Drop Zone */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Bulk Artwork Package (Optional ZIP / Folder)
                  </label>

                  <input
                    ref={archiveInputRef}
                    type="file"
                    accept=".zip,.rar,.tar,.7z,image/*"
                    onChange={(e) => handleArchiveFileSelect(e.target.files)}
                    className="hidden"
                  />

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => archiveInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                      isDragging
                        ? "border-blue-600 bg-blue-100/60"
                        : archiveFileName
                        ? "border-emerald-400 bg-emerald-50/50"
                        : "border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-slate-100/50"
                    }`}
                  >
                    {archiveFileName ? (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-200">
                        <div className="flex items-center gap-3 text-left">
                          <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{archiveFileName}</div>
                            <div className="text-[10px] text-slate-500">{archiveFileSize} • Ready for Pinata IPFS</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setArchiveFileName(null);
                            setArchiveFileSize(null);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="mx-auto h-11 w-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                          <UploadCloud className="h-6 w-6" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900">
                            Drag & drop your artwork ZIP archive or click to browse
                          </span>
                          <p className="text-[11px] text-slate-500 mt-0.5">Supports ZIP, RAR up to 500MB</p>
                        </div>
                        <span className="inline-inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-mono font-bold">
                          <Sparkles className="h-3 w-3" /> Pinata IPFS Decentralized Node Active
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Mint Pricing */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
                  Step 3: Mint & Sale Configuration (USDC)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Mint Price (Circle Testnet USDC) *</label>
                    <input
                      type="number"
                      value={formData.mintPrice}
                      onChange={(e) => setFormData({ ...formData, mintPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono font-bold text-blue-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Max Supply</label>
                    <input
                      type="number"
                      value={formData.maxSupply}
                      onChange={(e) => setFormData({ ...formData, maxSupply: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Max Mint Per Wallet</label>
                    <input
                      type="number"
                      value={formData.maxPerWallet}
                      onChange={(e) => setFormData({ ...formData, maxPerWallet: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Public Sale Start Date</label>
                    <input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Deploy & Contract Simulation */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
                  Step 4: Contract Verification & Deployment
                </h3>

                {/* Summary Table with Media Preview */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                    <img
                      src={formData.coverUrl}
                      alt="Cover Preview"
                      className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900">{formData.name} ({formData.symbol})</div>
                      <div className="text-slate-500 font-mono">{formData.category} • Royalty {formData.royalty}%</div>
                    </div>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Payment Token:</span>
                    <span className="text-blue-600 font-mono font-bold">Circle Testnet USDC</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Supply & Price:</span>
                    <span className="text-blue-600 font-mono font-bold">
                      {formData.maxSupply} NFTs @ {formData.mintPrice} USDC
                    </span>
                  </div>
                </div>

                {deployError && (
                  <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    <span>{deployError}</span>
                  </div>
                )}

                {/* Live Deployment Terminal Simulation */}
                {deployStep > 0 && (
                  <div className="rounded-xl border border-slate-900 bg-slate-950 p-4 font-mono text-xs space-y-2 text-white">
                    <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                      <span>ARC Smart Contract Compiler v0.8.20</span>
                      <span className="text-emerald-400">ERC-721A + USDC Enabled</span>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className={`flex items-center gap-2 ${deployStep >= 1 ? "text-blue-400" : "text-slate-600"}`}>
                        {deployStep === 1 ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                        <span>[1/3] Compiling ERC-721A USDC minting bytecode & gas optimization...</span>
                      </div>

                      <div className={`flex items-center gap-2 ${deployStep >= 2 ? "text-blue-400" : "text-slate-600"}`}>
                        {deployStep === 2 ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : deployStep > 2 ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : null}
                        <span>[2/3] Pinning uploaded media & metadata to IPFS storage...</span>
                      </div>

                      <div className={`flex items-center gap-2 ${deployStep >= 3 ? "text-blue-400" : "text-slate-600"}`}>
                        {deployStep === 3 ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : deployStep > 3 ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : null}
                        <span>[3/3] Submitting transaction to ARC Testnet & Prisma Database...</span>
                      </div>
                    </div>

                    {deployedContract && (
                      <div className="pt-3 border-t border-slate-800 text-emerald-400 space-y-1">
                        <div>✔ Contract Deployed & Persisted to Database!</div>
                        <div className="text-slate-300">Contract Address: <span className="text-blue-400">{deployedContract}</span></div>
                      </div>
                    )}
                  </div>
                )}

                {/* Final Deployed Redirect Box */}
                {deployedContract && (
                  <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">Your USDC Collection is Live!</div>
                      <div className="text-xs text-emerald-700">Persisted in Database & available for USDC minters</div>
                    </div>
                    <Link
                      href="/collections"
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      Manage Collection
                    </Link>
                  </div>
                )}

                {!deployedContract && (
                  <button
                    onClick={startDeployment}
                    disabled={deploying}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 text-white font-bold text-sm hover:opacity-95 transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {deploying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Deploying to ARC & Database...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4" /> Confirm & Deploy Collection (USDC)
                      </>
                    )}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-8">
            <button
              onClick={handleBack}
              disabled={step === 1 || deploying}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:text-slate-900 disabled:opacity-30 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            {step < 4 && (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
