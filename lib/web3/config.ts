import { defineChain, createPublicClient, http } from "viem";

/**
 * STRICT ENVIRONMENT VARIABLE READER & VALIDATOR
 * Next.js client bundler (Turbopack/Webpack) requires literal property access (e.g. process.env.NEXT_PUBLIC_CHAIN_ID)
 * to statically inline NEXT_PUBLIC_ variables into browser client bundles.
 */
function validateRequiredString(value: string | undefined, name: string): string {
  if (!value || value.trim() === "") {
    throw new Error(`[Strict Web3 Config Error] Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function validateEvmAddress(address: string, name: string): `0x${string}` {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error(`[Strict Web3 Config Error] Invalid EVM contract address in ${name}: "${address}"`);
  }
  return address as `0x${string}`;
}

function validateUrl(url: string, name: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error(`[Strict Web3 Config Error] Invalid URL format in ${name}: "${url}"`);
  }
  return url;
}

function validateChainId(chainIdStr: string): number {
  const parsed = Number(chainIdStr);
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error(`[Strict Web3 Config Error] Invalid numeric Chain ID in NEXT_PUBLIC_CHAIN_ID: "${chainIdStr}"`);
  }
  return parsed;
}

// Literal Static Property Accesses for Next.js Browser Client Inlining
const rawChainId = validateRequiredString(process.env.NEXT_PUBLIC_CHAIN_ID, "NEXT_PUBLIC_CHAIN_ID");
const rawChainName = validateRequiredString(process.env.NEXT_PUBLIC_CHAIN_NAME, "NEXT_PUBLIC_CHAIN_NAME");
const rawRpcUrl = validateRequiredString(process.env.NEXT_PUBLIC_RPC_URL, "NEXT_PUBLIC_RPC_URL");
const rawUsdcContract = validateRequiredString(process.env.NEXT_PUBLIC_USDC_CONTRACT, "NEXT_PUBLIC_USDC_CONTRACT");
const rawNftContract = validateRequiredString(process.env.NEXT_PUBLIC_NFT_CONTRACT, "NEXT_PUBLIC_NFT_CONTRACT");
const rawExplorerUrl = validateRequiredString(process.env.NEXT_PUBLIC_EXPLORER_URL, "NEXT_PUBLIC_EXPLORER_URL");
const rawCircleFaucetUrl = validateRequiredString(process.env.NEXT_PUBLIC_CIRCLE_FAUCET_URL, "NEXT_PUBLIC_CIRCLE_FAUCET_URL");
const rawCurrencyName = validateRequiredString(process.env.NEXT_PUBLIC_CURRENCY_NAME, "NEXT_PUBLIC_CURRENCY_NAME");
const rawCurrencySymbol = validateRequiredString(process.env.NEXT_PUBLIC_CURRENCY_SYMBOL, "NEXT_PUBLIC_CURRENCY_SYMBOL");
const rawCurrencyDecimals = validateRequiredString(process.env.NEXT_PUBLIC_CURRENCY_DECIMALS, "NEXT_PUBLIC_CURRENCY_DECIMALS");

/**
 * CENTRALIZED STRICT WEB3 SYSTEM CONFIGURATION
 */
export const WEB3_CONFIG = {
  chainId: validateChainId(rawChainId),
  chainName: rawChainName,
  rpcUrl: validateUrl(rawRpcUrl, "NEXT_PUBLIC_RPC_URL"),
  explorerUrl: validateUrl(rawExplorerUrl, "NEXT_PUBLIC_EXPLORER_URL"),
  usdcContractAddress: validateEvmAddress(rawUsdcContract, "NEXT_PUBLIC_USDC_CONTRACT"),
  nftContractAddress: validateEvmAddress(rawNftContract, "NEXT_PUBLIC_NFT_CONTRACT"),
  circleFaucetUrl: validateUrl(rawCircleFaucetUrl, "NEXT_PUBLIC_CIRCLE_FAUCET_URL"),
  nativeCurrency: {
    name: rawCurrencyName,
    symbol: rawCurrencySymbol,
    decimals: Number(rawCurrencyDecimals),
  },
  isDevelopment: process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEBUG === "true",
} as const;

/**
 * Single Unified Viem Chain Definition for ARC Network Testnet
 */
export const arcChain = defineChain({
  id: WEB3_CONFIG.chainId,
  name: WEB3_CONFIG.chainName,
  nativeCurrency: WEB3_CONFIG.nativeCurrency,
  rpcUrls: {
    default: { http: [WEB3_CONFIG.rpcUrl] },
    public: { http: [WEB3_CONFIG.rpcUrl] },
  },
  blockExplorers: {
    default: { name: "ARC Explorer", url: WEB3_CONFIG.explorerUrl },
  },
});

/**
 * Single Unified Viem Public Client Instance
 */
export const publicClient = createPublicClient({
  chain: arcChain,
  transport: http(WEB3_CONFIG.rpcUrl),
});

/**
 * Standardized ERC-20 Smart Contract ABI (Circle Testnet USDC)
 */
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "remaining", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "success", type: "bool" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    type: "function",
  },
] as const;

/**
 * Standardized ERC-721A NFT Smart Contract ABI
 */
export const ERC721A_ABI = [
  {
    inputs: [{ name: "quantity", type: "uint256" }],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mintPrice",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Helper Functions with Trailing Slash Removal
 */
export const getExplorerTxUrl = (txHash: string): string => {
  const baseUrl = WEB3_CONFIG.explorerUrl.replace(/\/$/, "");
  return `${baseUrl}/tx/${txHash}`;
};

export const getExplorerAddressUrl = (address: string): string => {
  const baseUrl = WEB3_CONFIG.explorerUrl.replace(/\/$/, "");
  return `${baseUrl}/address/${address}`;
};

export const formatAddress = (address?: string): string => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};
