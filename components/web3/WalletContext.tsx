"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAccount, useDisconnect, useBalance, useReadContract, useChainId, useSwitchChain } from "wagmi";
import { WEB3_CONFIG, publicClient, ERC20_ABI, formatAddress } from "@/lib/web3/config";
import { formatUnits } from "viem";

interface WalletContextType {
  isConnected: boolean;
  address: `0x${string}` | undefined;
  formattedAddress: string;
  usdcBalance: string;
  gasBalance: string;
  rawUsdcBalance: number;
  rawGasBalance: number;
  networkName: string;
  chainId: number;
  isWrongNetwork: boolean;
  circleFaucetUrl: string;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  disconnectWallet: () => void;
  switchToArcNetwork: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
  mounted: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const currentChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [directUsdcBalance, setDirectUsdcBalance] = useState<bigint | null>(null);

  const usdcAddress = WEB3_CONFIG.usdcContractAddress;

  // STAGE 1A: Dynamic ERC20 Decimals Read Hook with strict Chain ID
  const { data: rawDecimalsData } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: "decimals",
    chainId: WEB3_CONFIG.chainId,
    query: {
      staleTime: 60000, // Cache decimals for 60 seconds
    },
  });

  const decimals = typeof rawDecimalsData === "number" ? rawDecimalsData : 6;

  // STAGE 1B: Read Real On-Chain Native Gas Balance (ARC Token) - Optimized 12s polling to prevent RPC rate limiting
  const { data: gasBalanceData, refetch: refetchGas } = useBalance({
    address: address,
    chainId: WEB3_CONFIG.chainId,
    query: {
      enabled: !!address,
      refetchInterval: 12000,
      staleTime: 5000,
    },
  });

  // STAGE 1C: Read Real On-Chain USDC Balance - Optimized 12s polling to prevent RPC rate limiting
  const { data: rawUsdcBalanceData, refetch: refetchUsdc } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: WEB3_CONFIG.chainId,
    query: {
      enabled: !!address,
      refetchInterval: 12000,
      staleTime: 5000,
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Direct Viem RPC Fetch for Guaranteed On-Chain Balance Sync with Silent Error Handling
   */
  const fetchDirectBalance = useCallback(
    async (targetAddr: `0x${string}`) => {
      try {
        const usdcBal = (await publicClient.readContract({
          address: usdcAddress,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [targetAddr],
        })) as bigint;

        setDirectUsdcBalance(usdcBal);
      } catch (err) {
        // Silent RPC Error Handling for Rate Limiting
      }
    },
    [usdcAddress]
  );

  const refreshUserData = useCallback(async () => {
    if (!address) return;
    try {
      await fetchDirectBalance(address);
      await Promise.all([refetchGas(), refetchUsdc()]);
    } catch (err) {
      // Silent error handling
    }
  }, [address, fetchDirectBalance, refetchGas, refetchUsdc]);

  useEffect(() => {
    if (mounted && isConnected && address) {
      refreshUserData();
    }
  }, [mounted, isConnected, address, currentChainId, refreshUserData]);

  // Strict Network Switch & Validation Helper
  const isWrongNetwork = isConnected && currentChainId !== WEB3_CONFIG.chainId;

  const switchToArcNetwork = async (): Promise<boolean> => {
    if (switchChainAsync) {
      try {
        await switchChainAsync({ chainId: WEB3_CONFIG.chainId });
        await refreshUserData();
        return true;
      } catch (err) {
        return false;
      }
    }
    return false;
  };

  // DATA FLOW STAGE 1: Determine Active Raw BigInt (Prioritize positive on-chain balance)
  let activeUsdcBigInt: bigint = BigInt(0);
  if (typeof directUsdcBalance === "bigint" && directUsdcBalance > BigInt(0)) {
    activeUsdcBigInt = directUsdcBalance;
  } else if (typeof rawUsdcBalanceData === "bigint" && rawUsdcBalanceData > BigInt(0)) {
    activeUsdcBigInt = rawUsdcBalanceData;
  } else if (typeof directUsdcBalance === "bigint") {
    activeUsdcBigInt = directUsdcBalance;
  } else if (typeof rawUsdcBalanceData === "bigint") {
    activeUsdcBigInt = rawUsdcBalanceData;
  }

  // DATA FLOW STAGE 2: Format Units to Number & Formatted String
  const rawUsdcBalance = Number(formatUnits(activeUsdcBigInt, decimals));

  const rawGasBalance = gasBalanceData
    ? Number(formatUnits(gasBalanceData.value, gasBalanceData.decimals))
    : 0;

  const usdcBalance = `${rawUsdcBalance.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} USDC`;

  const gasBalance = `${rawGasBalance.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })} ${WEB3_CONFIG.nativeCurrency.symbol}`;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const disconnectWallet = () => {
    if (isConnected) {
      disconnect();
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected: mounted ? isConnected : false,
        address,
        formattedAddress: formatAddress(address),
        usdcBalance,
        gasBalance,
        rawUsdcBalance,
        rawGasBalance,
        networkName: WEB3_CONFIG.chainName,
        chainId: WEB3_CONFIG.chainId,
        isWrongNetwork,
        circleFaucetUrl: WEB3_CONFIG.circleFaucetUrl,
        isModalOpen,
        openModal,
        closeModal,
        disconnectWallet,
        switchToArcNetwork,
        refreshUserData,
        mounted,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
