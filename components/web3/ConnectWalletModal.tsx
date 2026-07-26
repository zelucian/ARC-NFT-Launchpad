"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "./WalletContext";
import { useConnect } from "wagmi";
import { WEB3_CONFIG } from "@/lib/web3/config";
import {
  MetaMaskIcon,
  CoinbaseIcon,
  RabbyIcon,
  BitgetIcon,
  WalletConnectIcon,
  OKXIcon,
  PhantomIcon,
  InjectedWalletIcon,
} from "./WalletIcons";
import {
  X,
  Wallet,
  CheckCircle2,
  Copy,
  LogOut,
  ExternalLink,
  Droplet,
  Coins,
  AlertTriangle,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface WalletDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isRecommended?: boolean;
  checkInstalled: () => boolean;
  downloadUrl: string;
  matchKeys: string[];
}

const WALLET_REGISTRY: WalletDefinition[] = [
  {
    id: "metamask",
    name: "MetaMask",
    description: "Popular browser extension & mobile app",
    icon: <MetaMaskIcon className="h-8 w-8" />,
    isRecommended: true,
    checkInstalled: () =>
      typeof window !== "undefined" &&
      !!(window as any).ethereum?.isMetaMask &&
      !(window as any).ethereum?.isRabby &&
      !(window as any).ethereum?.isBraveWallet,
    downloadUrl: "https://metamask.io/download/",
    matchKeys: ["metamask", "meta mask"],
  },
  {
    id: "bitget",
    name: "Bitget Wallet",
    description: "Leading Web3 multi-chain wallet & DEX",
    icon: <BitgetIcon className="h-8 w-8" />,
    isRecommended: true,
    checkInstalled: () =>
      typeof window !== "undefined" &&
      !!(
        (window as any).bitkeep?.ethereum ||
        (window as any).ethereum?.isBitKeep ||
        (window as any).ethereum?.isBitget
      ),
    downloadUrl: "https://web3.bitget.com/en/wallet-download",
    matchKeys: ["bitget", "bitkeep"],
  },
  {
    id: "rabby",
    name: "Rabby Wallet",
    description: "Smooth multi-chain EVM wallet for DeFi",
    icon: <RabbyIcon className="h-8 w-8" />,
    isRecommended: false,
    checkInstalled: () =>
      typeof window !== "undefined" && !!(window as any).ethereum?.isRabby,
    downloadUrl: "https://rabby.io/",
    matchKeys: ["rabby"],
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    description: "Secure self-custody wallet by Coinbase",
    icon: <CoinbaseIcon className="h-8 w-8" />,
    isRecommended: true,
    checkInstalled: () =>
      typeof window !== "undefined" &&
      !!(
        (window as any).ethereum?.isCoinbaseWallet ||
        (window as any).coinbaseWalletExtension
      ),
    downloadUrl: "https://www.coinbase.com/wallet",
    matchKeys: ["coinbase", "coinbasewallet"],
  },
  {
    id: "okx",
    name: "OKX Wallet",
    description: "Universal Web3 portal & EVM wallet",
    icon: <OKXIcon className="h-8 w-8" />,
    isRecommended: false,
    checkInstalled: () =>
      typeof window !== "undefined" &&
      !!((window as any).okxwallet || (window as any).ethereum?.isOkxWallet),
    downloadUrl: "https://www.okx.com/web3",
    matchKeys: ["okx"],
  },
  {
    id: "phantom",
    name: "Phantom (EVM)",
    description: "EVM & Solana multi-chain browser wallet",
    icon: <PhantomIcon className="h-8 w-8" />,
    isRecommended: false,
    checkInstalled: () =>
      typeof window !== "undefined" &&
      !!((window as any).phantom?.ethereum || (window as any).ethereum?.isPhantom),
    downloadUrl: "https://phantom.app/download",
    matchKeys: ["phantom"],
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    description: "Connect with 100+ mobile wallets via QR code",
    icon: <WalletConnectIcon className="h-8 w-8" />,
    isRecommended: true,
    checkInstalled: () => true, // Always available for QR connection
    downloadUrl: "https://walletconnect.com/",
    matchKeys: ["walletconnect"],
  },
  {
    id: "injected",
    name: "Browser Wallet",
    description: "Default Web3 browser extension provider",
    icon: <InjectedWalletIcon className="h-8 w-8" />,
    isRecommended: false,
    checkInstalled: () => typeof window !== "undefined" && !!(window as any).ethereum,
    downloadUrl: "https://metamask.io/download/",
    matchKeys: ["injected"],
  },
];

function WalletLogoIcon({ wallet }: { wallet: WalletDefinition }) {
  const [imgSrc, setImgSrc] = useState<string>(`/wallets/${wallet.id}.png`);
  const [useSvgFallback, setUseSvgFallback] = useState(false);

  return (
    <div className="w-[56px] h-[56px] min-w-[56px] min-h-[56px] rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 flex items-center justify-center flex-shrink-0 overflow-visible p-2 shadow-2xs group-hover:scale-105 transition-transform">
      {!useSvgFallback ? (
        <img
          src={imgSrc}
          alt={wallet.name}
          className="w-[32px] h-[32px] max-w-[32px] max-h-[32px] object-contain flex-shrink-0 rounded-lg"
          onError={() => {
            if (imgSrc.endsWith(".png")) {
              setImgSrc(`/wallets/${wallet.id}.svg`);
            } else {
              setUseSvgFallback(true);
            }
          }}
        />
      ) : (
        <div className="w-[32px] h-[32px] flex items-center justify-center flex-shrink-0">
          {wallet.icon}
        </div>
      )}
    </div>
  );
}

export function ConnectWalletModal() {
  const {
    isModalOpen,
    closeModal,
    isConnected,
    address,
    formattedAddress,
    usdcBalance,
    gasBalance,
    networkName,
    chainId,
    isWrongNetwork,
    switchToArcNetwork,
    circleFaucetUrl,
    disconnectWallet,
    mounted,
  } = useWallet();

  const { connectors, connectAsync, isPending, error: connectError } = useConnect();
  const [copied, setCopied] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [clientMounted, setClientMounted] = useState(false);

  useEffect(() => {
    setClientMounted(true);
  }, []);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnectConnector = async (connector: any, walletDef?: WalletDefinition) => {
    setConnectingId(walletDef ? walletDef.id : connector.id);
    setLocalError(null);
    try {
      await connectAsync({ connector });
      closeModal();
    } catch (err: any) {
      console.warn("Wallet connection error:", err);
      setLocalError(err.message || "Failed to connect to wallet");
    } finally {
      setConnectingId(null);
    }
  };

  /**
   * Smart Wallet Deduplication & Priority Sorting Engine
   */
  const processWallets = () => {
    if (!clientMounted) return { installed: [], available: [] };

    const matchedMap = new Map<string, { wallet: WalletDefinition; connector: any; isInstalled: boolean }>();
    const usedConnectorIds = new Set<string>();

    // Step 1: Match Wagmi connectors to target wallet definitions
    WALLET_REGISTRY.forEach((def) => {
      const isInstalled = def.checkInstalled();

      // Find matching connector
      const matchedConnector = connectors.find((c) => {
        if (usedConnectorIds.has(c.id)) return false;
        const cName = c.name.toLowerCase();
        const cId = c.id.toLowerCase();
        return def.matchKeys.some((k) => cName.includes(k) || cId.includes(k));
      });

      if (matchedConnector) {
        usedConnectorIds.add(matchedConnector.id);
      }

      // Fallback: If injected connector exists and wallet is installed in window.ethereum
      const finalConnector = matchedConnector || connectors.find((c) => c.id === "injected" || c.type === "injected");

      matchedMap.set(def.id, {
        wallet: def,
        connector: finalConnector,
        isInstalled,
      });
    });

    // Step 2: Injected fallback cleanup (only show generic Injected if no specific wallet matches)
    const specificInstalled = Array.from(matchedMap.values()).some(
      (item) => item.wallet.id !== "injected" && item.wallet.id !== "walletconnect" && item.isInstalled
    );

    const resultList = Array.from(matchedMap.values()).filter((item) => {
      if (item.wallet.id === "injected" && specificInstalled) {
        return false; // Hide generic injected when specific wallet (MetaMask/Bitget/etc) is detected!
      }
      return true;
    });

    // Step 3: Categorize into Installed vs Available (Recommended/Popular)
    const installed = resultList.filter((item) => item.isInstalled && item.wallet.id !== "walletconnect");
    const available = resultList.filter((item) => !item.isInstalled || item.wallet.id === "walletconnect");

    return { installed, available };
  };

  const { installed, available } = processWallets();

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md"
          />

          {/* Modal Card - RainbowKit / OpenSea Modern Aesthetics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151821] p-6 shadow-2xl z-10 text-slate-900 dark:text-white"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-sky-500/10 dark:bg-sky-600/15 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                  <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  {mounted && isConnected ? "Connected Wallet" : "Connect a Wallet"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ARC Network <span className="text-blue-600 dark:text-blue-400 font-semibold font-mono">(Chain ID {chainId})</span>
                </p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Network Warning Banner */}
            {isWrongNetwork && (
              <div className="mt-4 p-3.5 rounded-2xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <span>Wrong Network. Switch to <strong>{WEB3_CONFIG.chainName}</strong>.</span>
                </div>
                <button
                  onClick={switchToArcNetwork}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors shadow-xs flex-shrink-0"
                >
                  Switch Network
                </button>
              </div>
            )}

            {/* Modal Body */}
            {mounted && isConnected ? (
              <div className="py-5 space-y-4">
                {/* Address Card */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium">Connected On-Chain Address</span>
                    <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{formattedAddress}</span>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-colors"
                    >
                      {copied ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Real On-Chain Balances */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101218] p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span>On-Chain Balances</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">ARC Testnet</span>
                  </div>

                  {/* USDC Balance */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xs font-mono">
                        $
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Circle Testnet USDC</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Mint Token</div>
                      </div>
                    </div>
                    <span className="font-mono font-black text-sm text-blue-600 dark:text-blue-400">{usdcBalance}</span>
                  </div>

                  {/* Native Gas Balance */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs">
                        <Coins className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Native Gas Balance</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{WEB3_CONFIG.chainName} Gas</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">{gasBalance}</span>
                  </div>
                </div>

                {/* Circle Faucet Banner */}
                <div className="rounded-2xl border border-blue-200 dark:border-blue-800/80 bg-gradient-to-r from-blue-50/80 to-sky-50/80 dark:from-blue-950/40 dark:to-sky-950/40 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold text-xs">
                      <Droplet className="h-4 w-4 text-blue-600 dark:text-blue-400 fill-blue-100 dark:fill-blue-950" />
                      <span>Official Circle Testnet Faucet</span>
                    </div>
                    <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-900/80 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold border border-blue-200 dark:border-blue-800">
                      USDC
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Request free Circle Testnet USDC to mint NFTs on ARC Network.
                  </p>
                  <a
                    href={circleFaucetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    Get Free USDC <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                {/* Disconnect Button */}
                <button
                  onClick={() => {
                    disconnectWallet();
                    closeModal();
                  }}
                  className="w-full py-3 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <div className="py-4 space-y-4">
                {(localError || connectError) && (
                  <div className="p-3 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs">
                    {localError || connectError?.message}
                  </div>
                )}

                <div className="max-h-80 overflow-y-auto pr-1 space-y-4">
                  {/* Section 1: Detected / Installed Wallets (Highest Priority) */}
                  {installed.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Installed Wallets
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Detected in browser</span>
                      </div>

                      {installed.map(({ wallet, connector }) => (
                        <div
                          key={wallet.id}
                          className="group relative flex items-center justify-between p-3.5 rounded-2xl border border-emerald-300/80 dark:border-emerald-800/80 bg-gradient-to-r from-emerald-50/50 via-white to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg shadow-emerald-500/5 transition-all"
                        >
                          <div className="flex items-center gap-3.5">
                            {/* Standardized 56x56 Container with 32x32 Logo */}
                            <WalletLogoIcon wallet={wallet} />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                  {wallet.name}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                  Installed
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">{wallet.description}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleConnectConnector(connector, wallet)}
                            disabled={isPending && connectingId === wallet.id}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0"
                          >
                            {isPending && connectingId === wallet.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-white" />
                            ) : (
                              <>
                                <span>Connect</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Section 2: Popular & Recommended Wallets */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono pt-1">
                      <span>{installed.length > 0 ? "Other Supported Wallets" : "Select Wallet Provider"}</span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400">Web3 Multi-Chain</span>
                    </div>

                    {available.map(({ wallet, connector }) => (
                      <div
                        key={wallet.id}
                        className="group flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800/90 hover:border-blue-500/80 dark:hover:border-blue-500/80 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3.5">
                          {/* Standardized 56x56 Container with 32x32 Logo */}
                          <WalletLogoIcon wallet={wallet} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {wallet.name}
                              </span>
                              {wallet.isRecommended && (
                                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">{wallet.description}</div>
                          </div>
                        </div>

                        {connector ? (
                          <button
                            onClick={() => handleConnectConnector(connector, wallet)}
                            disabled={isPending && connectingId === wallet.id}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0"
                          >
                            {isPending && connectingId === wallet.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-white" />
                            ) : (
                              <span>Connect</span>
                            )}
                          </button>
                        ) : (
                          <a
                            href={wallet.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all flex items-center gap-1 flex-shrink-0 shadow-xs"
                          >
                            Install <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 text-center">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Connected to {WEB3_CONFIG.chainName} (Chain ID: {chainId})
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
