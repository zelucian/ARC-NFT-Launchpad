"use client";

import { useState, useEffect } from "react";

export interface WalletOption {
  id: string;
  name: string;
  icon: string; // SVG or image or lucide icon name
  downloadUrl: string;
  isInstalled: boolean;
  isPopular?: boolean;
  description: string;
}

export function useDetectedWallets() {
  const [installedFlags, setInstalledFlags] = useState<{ [key: string]: boolean }>({
    metaMask: false,
    coinbase: false,
    phantom: false,
    rabby: false,
    okx: false,
    trust: false,
    brave: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkInstalled = () => {
      const eth = (window as any).ethereum;
      const phantomEth = (window as any).phantom?.ethereum;
      const okx = (window as any).okxwallet;
      const trust = (window as any).trustWallet;
      const coinbase = (window as any).coinbaseWalletExtension;

      const detected = {
        metaMask: Boolean(eth?.isMetaMask && !eth?.isBraveWallet && !eth?.isRabby),
        coinbase: Boolean(coinbase || eth?.isCoinbaseWallet),
        phantom: Boolean(phantomEth || eth?.isPhantom),
        rabby: Boolean(eth?.isRabby),
        okx: Boolean(okx || eth?.isOkxWallet),
        trust: Boolean(trust || eth?.isTrust || eth?.isTrustWallet),
        brave: Boolean(eth?.isBraveWallet),
      };

      setInstalledFlags(detected);
    };

    checkInstalled();

    // Listen for EIP-6963 provider announcements
    const handleAnnounce = (event: any) => {
      if (event?.detail?.info) {
        const name = String(event.detail.info.name).toLowerCase();
        setInstalledFlags((prev) => ({
          ...prev,
          metaMask: prev.metaMask || name.includes("metamask"),
          coinbase: prev.coinbase || name.includes("coinbase"),
          phantom: prev.phantom || name.includes("phantom"),
          rabby: prev.rabby || name.includes("rabby"),
          okx: prev.okx || name.includes("okx"),
          trust: prev.trust || name.includes("trust"),
          brave: prev.brave || name.includes("brave"),
        }));
      }
    };

    window.addEventListener("eip6963:announceProvider", handleAnnounce);
    // Request announcement
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () => {
      window.removeEventListener("eip6963:announceProvider", handleAnnounce);
    };
  }, []);

  const walletList: WalletOption[] = [
    {
      id: "metaMask",
      name: "MetaMask",
      icon: "🦊",
      downloadUrl: "https://metamask.io/download/",
      isInstalled: installedFlags.metaMask,
      isPopular: true,
      description: "Connect to your MetaMask Browser Extension",
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      icon: "🔵",
      downloadUrl: "https://www.coinbase.com/wallet",
      isInstalled: installedFlags.coinbase,
      isPopular: true,
      description: "Connect using Coinbase Wallet extension or app",
    },
    {
      id: "phantom",
      name: "Phantom Wallet",
      icon: "👻",
      downloadUrl: "https://phantom.app/download",
      isInstalled: installedFlags.phantom,
      isPopular: true,
      description: "Multichain EVM & Solana wallet extension",
    },
    {
      id: "rabby",
      name: "Rabby Wallet",
      icon: "🐰",
      downloadUrl: "https://rabby.io/",
      isInstalled: installedFlags.rabby,
      description: "Game-changing Web3 security wallet extension",
    },
    {
      id: "okx",
      name: "OKX Wallet",
      icon: "🖤",
      downloadUrl: "https://www.okx.com/web3",
      isInstalled: installedFlags.okx,
      description: "Universal Web3 multichain browser extension",
    },
    {
      id: "trust",
      name: "Trust Wallet",
      icon: "🛡️",
      downloadUrl: "https://trustwallet.com/browser-extension",
      isInstalled: installedFlags.trust,
      description: "Secure crypto wallet & extension",
    },
    {
      id: "brave",
      name: "Brave Wallet",
      icon: "🦁",
      downloadUrl: "https://brave.com/wallet/",
      isInstalled: installedFlags.brave,
      description: "Native privacy browser Web3 wallet",
    },
  ];

  return { walletList, installedFlags };
}
