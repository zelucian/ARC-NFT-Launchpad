"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NFTCollection } from "@/lib/mockData";
import { useWallet } from "./WalletContext";
import { useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import {
  WEB3_CONFIG,
  publicClient,
  ERC20_ABI,
  ERC721A_ABI,
  getExplorerTxUrl,
} from "@/lib/web3/config";
import {
  X,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Droplet,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface MintModalProps {
  collection: NFTCollection | null;
  isOpen: boolean;
  onClose: () => void;
}

type MintStage = "idle" | "approving_usdc" | "minting_nft" | "verifying_db" | "success" | "error";

export function MintModal({ collection, isOpen, onClose }: MintModalProps) {
  const {
    isConnected,
    address,
    rawUsdcBalance,
    usdcBalance,
    openModal: openWalletModal,
    circleFaucetUrl,
    isWrongNetwork,
    switchToArcNetwork,
    refreshUserData,
  } = useWallet();

  const { writeContractAsync } = useWriteContract();

  const [quantity, setQuantity] = useState(1);
  const [mintStage, setMintStage] = useState<MintStage>("idle");
  const [txHash, setTxHash] = useState<string>("");
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [gasUsed, setGasUsed] = useState<string>("");
  const [tokenId, setTokenId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  if (!collection) return null;

  const totalPrice = collection.mintPrice * quantity;
  const isSoldOut = collection.mintedSupply >= collection.maxSupply;
  const hasInsufficientUsdc = isConnected && rawUsdcBalance < totalPrice;

  const handleMintOnChain = async () => {
    if (!isConnected || !address) {
      openWalletModal();
      return;
    }

    if (isWrongNetwork) {
      const switched = await switchToArcNetwork();
      if (!switched) {
        setErrorMessage(`Your wallet is currently connected to an unsupported network. Please approve switching network to ${WEB3_CONFIG.chainName} (Chain ID ${WEB3_CONFIG.chainId}) in your wallet.`);
        setMintStage("error");
      }
      return;
    }

    if (hasInsufficientUsdc) {
      window.open(circleFaucetUrl, "_blank");
      return;
    }

    setErrorMessage("");

    try {
      const totalPriceUnits = parseUnits(totalPrice.toString(), 6);
      const usdcAddress = WEB3_CONFIG.usdcContractAddress;
      const isValidEvmHex = /^0x[a-fA-F0-9]{40}$/.test(collection.contractAddress || "");
      const collectionContractAddress = isValidEvmHex
        ? (collection.contractAddress as `0x${string}`)
        : WEB3_CONFIG.nftContractAddress;

      // Step 1: Execute Real On-Chain USDC Token Payment Transfer
      setMintStage("approving_usdc");

      // Transfer USDC tokens on-chain from user to collection recipient / contract
      const recipientAddress = collectionContractAddress;
      const paymentTx = await writeContractAsync({
        address: usdcAddress,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [recipientAddress, totalPriceUnits],
        chainId: WEB3_CONFIG.chainId,
      });

      await publicClient.waitForTransactionReceipt({ hash: paymentTx });

      // Step 2: Execute Real On-Chain ERC-721A Mint
      setMintStage("minting_nft");

      const mintTx = await writeContractAsync({
        address: collectionContractAddress,
        abi: ERC721A_ABI,
        functionName: "mint",
        args: [BigInt(quantity)],
        chainId: WEB3_CONFIG.chainId,
      });

      setTxHash(mintTx);

      // Step 3: Wait for On-Chain Block Receipt Confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash: mintTx });

      if (receipt.status !== "success") {
        throw new Error("On-chain mint transaction was reverted by EVM node");
      }

      setBlockNumber(Number(receipt.blockNumber));
      setGasUsed(receipt.gasUsed.toString());

      // Step 4: Verify Transaction & Save to Database
      setMintStage("verifying_db");

      const res = await fetch("/api/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectionId: collection.id,
          minterAddress: address,
          quantity,
          txHash: mintTx,
          blockNumber: Number(receipt.blockNumber),
          gasUsed: receipt.gasUsed.toString(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Database verification failed");
      }

      if (data.data?.mintRecord?.id) {
        setTokenId(data.data.mintRecord.id.slice(0, 6));
      }

      setMintStage("success");

      // Local state update & refresh on-chain balances immediately
      collection.mintedSupply += quantity;
      collection.totalVolume += totalPrice;
      if (collection.mintedSupply >= collection.maxSupply) {
        collection.status = "Sold Out";
      }

      await refreshUserData();
    } catch (err: any) {
      console.error("On-chain minting error:", err);
      const rawMsg = err?.shortMessage || err?.message || "Failed to execute on-chain minting transaction";
      if (
        rawMsg.includes("does not match the target chain") ||
        rawMsg.includes("Chain ID") ||
        rawMsg.includes("target chain") ||
        rawMsg.includes("204") ||
        rawMsg.includes("id: 1")
      ) {
        setErrorMessage(`Network Mismatch: Your wallet extension is connected to an unsupported network (e.g. Ethereum / Chain ID 1). Please switch your wallet network to ${WEB3_CONFIG.chainName} (Chain ID ${WEB3_CONFIG.chainId}) to proceed.`);
      } else if (rawMsg.includes("request limit reached")) {
        setErrorMessage("ARC Testnet RPC node is temporarily busy (rate limit reached). Please wait 5 seconds and try again.");
      } else {
        setErrorMessage(rawMsg);
      }
      setMintStage("error");
    }
  };

  const handleReset = () => {
    setMintStage("idle");
    setQuantity(1);
    setErrorMessage("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1A1D24] p-6 shadow-2xl z-10 text-slate-900 dark:text-white"
          >
            {/* Background Glow */}
            <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-sky-500/10 dark:bg-sky-600/10 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex-shrink-0">
                  <img
                    src={collection.featuredImage || collection.bannerImage}
                    alt={collection.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                    {collection.name}
                    {collection.isVerified && (
                      <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">By {collection.creatorName}</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Network Warning Banner */}
            {isWrongNetwork && (
              <div className="mt-4 p-3.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <span>Wrong Network. Switch to <strong>{WEB3_CONFIG.chainName}</strong> to mint.</span>
                </div>
                <button
                  onClick={switchToArcNetwork}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors shadow-xs"
                >
                  Switch Network
                </button>
              </div>
            )}

            {/* Modal Body */}
            {mintStage === "idle" && (
              <div className="py-5 space-y-5">
                {/* Quantity Controls */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Select Quantity</span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold">
                      Max 5 per transaction
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || isSoldOut}
                        className="h-10 w-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors shadow-xs"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-lg font-mono font-bold text-slate-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(5, quantity + 1))}
                        disabled={quantity >= 5 || isSoldOut}
                        className="h-10 w-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors shadow-xs"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Total Price (USDC)</div>
                      <div className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400">
                        {totalPrice} USDC
                      </div>
                    </div>
                  </div>
                </div>

                {/* On-Chain Pricing & Balance Breakdown */}
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 px-1">
                  <div className="flex justify-between">
                    <span>NFT Unit Price:</span>
                    <span className="text-slate-900 dark:text-white font-mono font-semibold">{collection.mintPrice} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated ARC Network Gas Fee:</span>
                    <span className="text-slate-900 dark:text-white font-mono font-semibold">~0.0012 ARC</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2">
                    <span>On-Chain USDC Balance:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">{usdcBalance}</span>
                  </div>
                </div>

                {/* Circle Faucet Low Balance Warning Banner */}
                {hasInsufficientUsdc && (
                  <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-amber-900 dark:text-amber-300 font-bold">
                      <span>Insufficient USDC Balance</span>
                      <Droplet className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-amber-800 dark:text-amber-300 text-[11px]">
                      Your on-chain USDC balance is too low for this mint ({totalPrice} USDC required). Get free Circle Testnet USDC to proceed.
                    </p>
                    <a
                      href={circleFaucetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 font-bold hover:underline"
                    >
                      Get Free USDC on Circle Faucet <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {/* Mint Action Button */}
                {!isConnected ? (
                  <button
                    onClick={openWalletModal}
                    className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                  >
                    Connect Wallet to Mint
                  </button>
                ) : isWrongNetwork ? (
                  <button
                    onClick={switchToArcNetwork}
                    className="w-full py-3.5 rounded-xl bg-amber-600 text-white font-bold text-sm hover:bg-amber-700 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    Switch to {WEB3_CONFIG.chainName}
                  </button>
                ) : isSoldOut ? (
                  <button
                    disabled
                    className="w-full py-3.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-sm cursor-not-allowed text-center"
                  >
                    Collection Sold Out
                  </button>
                ) : hasInsufficientUsdc ? (
                  <a
                    href={circleFaucetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 text-center"
                  >
                    <Droplet className="h-4 w-4" /> Get USDC on Circle Faucet
                  </a>
                ) : (
                  <button
                    onClick={handleMintOnChain}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 text-white font-bold text-sm hover:from-blue-700 hover:to-sky-600 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-4 w-4 text-blue-100" />
                    Mint On-Chain ({totalPrice} USDC)
                  </button>
                )}
              </div>
            )}

            {/* Progress Stages */}
            {mintStage !== "idle" && mintStage !== "success" && mintStage !== "error" && (
              <div className="py-10 text-center space-y-4">
                <div className="relative mx-auto h-16 w-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 border-t-blue-600 animate-spin" />
                  <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {mintStage === "approving_usdc"
                      ? "[1/3] Executing Real Circle USDC Token Payment On-Chain..."
                      : mintStage === "minting_nft"
                      ? "[2/3] Executing Smart Contract Mint on ARC Network..."
                      : "[3/3] Verifying On-Chain Receipt & Syncing Database..."}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Please confirm the transaction prompt in your Web3 wallet extension.
                  </p>
                </div>
              </div>
            )}

            {/* Mint Error Stage */}
            {mintStage === "error" && (
              <div className="py-8 text-center space-y-4">
                <div className="mx-auto h-14 w-14 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 flex items-center justify-center font-bold text-xl">
                  ✕
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">On-Chain Transaction Failed</h4>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 max-w-xs mx-auto">{errorMessage}</p>
                </div>
                <button
                  onClick={() => setMintStage("idle")}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Mint Real On-Chain Receipt Stage */}
            {mintStage === "success" && (
              <div className="py-6 text-center space-y-5">
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">On-Chain Mint Successful!</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Minted {quantity} NFT(s) from {collection.name} for {totalPrice} USDC.
                  </p>
                </div>

                {/* Comprehensive Real On-Chain Transaction Receipt */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 space-y-2.5 text-left text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="font-semibold text-slate-900 dark:text-white">On-Chain Receipt Summary</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">Confirmed</span>
                  </div>

                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Transaction Hash:</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
                      {txHash ? `${txHash.slice(0, 10)}...${txHash.slice(-8)}` : "0x..."}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Block Number:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">
                      #{blockNumber || "Pending"}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Gas Used:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">
                      {gasUsed} Units
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Mint Price:</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                      {totalPrice} USDC
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Token ID:</span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">
                      #{tokenId}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={getExplorerTxUrl(txHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View on ARC Explorer
                  </a>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
