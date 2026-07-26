import { COLLECTION_IMAGES } from "./collectionImages";

export interface NFTCollection {
  id: string;
  name: string;
  symbol: string;
  description: string;
  bannerImage: string;
  featuredImage: string;
  creatorName: string;
  creatorAvatar: string;
  creatorAddress: string;
  mintPrice: number; // In USDC
  maxSupply: number;
  mintedSupply: number;
  category: "Art" | "Gaming" | "PFP" | "Music" | "RWA" | "Utility";
  status: "Live Minting" | "Upcoming" | "Sold Out" | "Ended";
  isVerified: boolean;
  royaltyFee: number; // percentage e.g. 5
  mintStartDate: string;
  totalVolume: number; // in USDC
  contractAddress: string;
  featuredOrder?: number;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  address: string;
  totalCollections: number;
  totalVolume: number; // in USDC
  verified: boolean;
}

export const MOCK_CREATORS: Creator[] = [
  {
    id: "creator-1",
    name: "Zelucian",
    handle: "@zelucian",
    avatar: COLLECTION_IMAGES.col1.featured,
    address: "0x71C...89A2",
    totalCollections: 14,
    totalVolume: 142000,
    verified: true,
  },
  {
    id: "creator-2",
    name: "CyberPunk Studio",
    handle: "@zelucian",
    avatar: COLLECTION_IMAGES.col2.featured,
    address: "0x3F2...11C8",
    totalCollections: 8,
    totalVolume: 98500,
    verified: true,
  },
  {
    id: "creator-3",
    name: "Vortex Realm",
    handle: "@zelucian",
    avatar: COLLECTION_IMAGES.col4.featured,
    address: "0x89A...44E1",
    totalCollections: 5,
    totalVolume: 64200,
    verified: true,
  },
  {
    id: "creator-4",
    name: "Kroma Syndicate",
    handle: "@zelucian",
    avatar: COLLECTION_IMAGES.col3.featured,
    address: "0x12B...90FA",
    totalCollections: 11,
    totalVolume: 210000,
    verified: true,
  },
];

export const MOCK_COLLECTIONS: NFTCollection[] = [
  {
    id: "col-chronos",
    name: "ARC Cyber Chronos",
    symbol: "CHRONOS",
    description: "2,500 time-shifting Cybernetic Chronos sentinels equipped with ARC quantum chronometer telemetry & USDC minting.",
    bannerImage: "/images/arc-cyber-chronos.jpg",
    featuredImage: "/images/arc-cyber-chronos.jpg",
    creatorName: "Zelucian",
    creatorAvatar: COLLECTION_IMAGES.col1.featured,
    creatorAddress: "0x71C9382190A4532B81F198302193819F9A1D89A2",
    mintPrice: 20, // 20 USDC
    maxSupply: 2500,
    mintedSupply: 825, // Exactly 33% (825 / 2500)
    category: "PFP",
    status: "Live Minting",
    isVerified: true,
    royaltyFee: 5,
    mintStartDate: "2026-07-26T12:00:00Z",
    totalVolume: 16500,
    contractAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    featuredOrder: 1,
  },
  {
    id: "col-1",
    name: "Aether Sentinels Genesis",
    symbol: "ASG",
    description: "3,333 hyper-futuristic 3D avatars empowered by the ARC Engine. Minted with Circle Testnet USDC.",
    bannerImage: COLLECTION_IMAGES.col1.banner,
    featuredImage: COLLECTION_IMAGES.col1.featured,
    creatorName: "Zelucian",
    creatorAvatar: COLLECTION_IMAGES.col1.featured,
    creatorAddress: "0x71C9382190A4532B81F198302193819F9A1D89A2",
    mintPrice: 25, // 25 USDC
    maxSupply: 3333,
    mintedSupply: 2489,
    category: "PFP",
    status: "Live Minting",
    isVerified: true,
    royaltyFee: 5,
    mintStartDate: "2026-07-24T12:00:00Z",
    totalVolume: 62225,
    contractAddress: "0x71C9382190A4532B81F198302193819F9A1D89A2",
    featuredOrder: 2,
  },
  {
    id: "col-3",
    name: "ARC Neon Racers",
    symbol: "RACE",
    description: "High-octane Web3 gaming vehicles equipped with custom ARC physics telemetry and USDC minting.",
    bannerImage: COLLECTION_IMAGES.col3.banner,
    featuredImage: COLLECTION_IMAGES.col3.featured,
    creatorName: "Kroma Syndicate",
    creatorAvatar: COLLECTION_IMAGES.col3.featured,
    creatorAddress: "0x12B890F09812903487192A012903829038290FA",
    mintPrice: 40, // 40 USDC
    maxSupply: 5000,
    mintedSupply: 1240,
    category: "Gaming",
    status: "Live Minting",
    isVerified: true,
    royaltyFee: 4,
    mintStartDate: "2026-07-25T00:00:00Z",
    totalVolume: 49600,
    contractAddress: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    featuredOrder: 3,
  },
  {
    id: "col-4",
    name: "Spectral Soundwaves",
    symbol: "WAVE",
    description: "Interactive audio-reactive digital vinyl records stored permanently on IPFS & ARC Network contracts.",
    bannerImage: COLLECTION_IMAGES.col4.banner,
    featuredImage: COLLECTION_IMAGES.col4.featured,
    creatorName: "Vortex Realm",
    creatorAvatar: COLLECTION_IMAGES.col4.featured,
    creatorAddress: "0x89A120194A09123891048123901A837198244E1",
    mintPrice: 10, // 10 USDC
    maxSupply: 2000,
    mintedSupply: 0,
    category: "Music",
    status: "Upcoming",
    isVerified: false,
    royaltyFee: 6,
    mintStartDate: "2026-08-01T15:00:00Z",
    totalVolume: 0,
    contractAddress: "0x34298A0192847291048123901A837198244E1019A",
    featuredOrder: 4,
  },
  {
    id: "col-5",
    name: "Hyperion Real Estate Passes",
    symbol: "HRE",
    description: "Tokenized fractional ownership rights in futuristic Web3 data centers, purchased via USDC.",
    bannerImage: COLLECTION_IMAGES.col5.banner,
    featuredImage: COLLECTION_IMAGES.col5.featured,
    creatorName: "Hyperion Protocol",
    creatorAvatar: COLLECTION_IMAGES.col5.featured,
    creatorAddress: "0x551902847291048123901A837198244E1019A1",
    mintPrice: 100, // 100 USDC
    maxSupply: 500,
    mintedSupply: 312,
    category: "RWA",
    status: "Live Minting",
    isVerified: true,
    royaltyFee: 2.5,
    mintStartDate: "2026-07-20T10:00:00Z",
    totalVolume: 31200,
    contractAddress: "0x772847291048123901A83719829034E2019A1009",
    featuredOrder: 5,
  },
  {
    id: "col-6",
    name: "Quantum Void Monoliths",
    symbol: "VOID",
    description: "Minimalist geometric monuments suspended in zero-gravity space. Sold out in USDC presale.",
    bannerImage: COLLECTION_IMAGES.col6.banner,
    featuredImage: COLLECTION_IMAGES.col6.featured,
    creatorName: "Zelucian",
    creatorAvatar: COLLECTION_IMAGES.col6.featured,
    creatorAddress: "0x71C9382190A4532B81F198302193819F9A1D89A2",
    mintPrice: 50, // 50 USDC
    maxSupply: 777,
    mintedSupply: 777,
    category: "Art",
    status: "Sold Out",
    isVerified: true,
    royaltyFee: 5,
    mintStartDate: "2026-06-10T12:00:00Z",
    totalVolume: 38850,
    contractAddress: "0x991048123901A83719829034E2019A1009772847",
    featuredOrder: 6,
  },
  {
    id: "col-7",
    name: "Cybernetic Cyberpunks",
    symbol: "CYBER",
    description: "1,111 unique cyborg avatar identities for metaverse exploration on ARC Network.",
    bannerImage: COLLECTION_IMAGES.col7.banner,
    featuredImage: COLLECTION_IMAGES.col7.featured,
    creatorName: "CyberPunk Studio",
    creatorAvatar: COLLECTION_IMAGES.col7.featured,
    creatorAddress: "0x3F2819C1048700201991823901A8371982D11C8",
    mintPrice: 30,
    maxSupply: 1111,
    mintedSupply: 800,
    category: "PFP",
    status: "Live Minting",
    isVerified: true,
    royaltyFee: 5,
    mintStartDate: "2026-07-22T10:00:00Z",
    totalVolume: 24000,
    contractAddress: "0x771048123901A83719829034E2019A1009772899",
  },
  {
    id: "col-8",
    name: "Solaria Energy Grids",
    symbol: "GRID",
    description: "Fractional tokenized solar energy micro-grids delivering automated yield payouts in USDC.",
    bannerImage: COLLECTION_IMAGES.col8.banner,
    featuredImage: COLLECTION_IMAGES.col8.featured,
    creatorName: "Hyperion Protocol",
    creatorAvatar: COLLECTION_IMAGES.col8.featured,
    creatorAddress: "0x551902847291048123901A837198244E1019A1",
    mintPrice: 150,
    maxSupply: 300,
    mintedSupply: 150,
    category: "RWA",
    status: "Live Minting",
    isVerified: true,
    royaltyFee: 3,
    mintStartDate: "2026-07-18T14:00:00Z",
    totalVolume: 22500,
    contractAddress: "0x881048123901A83719829034E2019A1009772811",
  },
  {
    id: "col-9",
    name: "Nebula Synth Beats",
    symbol: "SYNTH",
    description: "Generative synthwave audio NFTs giving holders commercial licensing rights.",
    bannerImage: COLLECTION_IMAGES.col9.banner,
    featuredImage: COLLECTION_IMAGES.col9.featured,
    creatorName: "Vortex Realm",
    creatorAvatar: COLLECTION_IMAGES.col9.featured,
    creatorAddress: "0x89A120194A09123891048123901A837198244E1",
    mintPrice: 20,
    maxSupply: 1500,
    mintedSupply: 0,
    category: "Music",
    status: "Upcoming",
    isVerified: false,
    royaltyFee: 5,
    mintStartDate: "2026-08-05T12:00:00Z",
    totalVolume: 0,
    contractAddress: "0x111048123901A83719829034E2019A1009772822",
  },
  {
    id: "col-10",
    name: "Galactic Starships Pass",
    symbol: "SHIP",
    description: "Utility passes for interstellar Web3 gaming fleets on ARC Network.",
    bannerImage: COLLECTION_IMAGES.col10.banner,
    featuredImage: COLLECTION_IMAGES.col10.featured,
    creatorName: "Kroma Syndicate",
    creatorAvatar: COLLECTION_IMAGES.col10.featured,
    creatorAddress: "0x12B890F09812903487192A012903829038290FA",
    mintPrice: 75,
    maxSupply: 2500,
    mintedSupply: 2500,
    category: "Utility",
    status: "Sold Out",
    isVerified: true,
    royaltyFee: 4.5,
    mintStartDate: "2026-06-01T09:00:00Z",
    totalVolume: 187500,
    contractAddress: "0x221048123901A83719829034E2019A1009772833",
  },
  {
    id: "col-11",
    name: "Aetheria Land Parcels",
    symbol: "LAND",
    description: "Virtual land coordinates in the Aetheria central metaverse hub.",
    bannerImage: COLLECTION_IMAGES.col11.banner,
    featuredImage: COLLECTION_IMAGES.col11.featured,
    creatorName: "Zelucian",
    creatorAvatar: COLLECTION_IMAGES.col11.featured,
    creatorAddress: "0x71C9382190A4532B81F198302193819F9A1D89A2",
    mintPrice: 200,
    maxSupply: 500,
    mintedSupply: 420,
    category: "Gaming",
    status: "Live Minting",
    isVerified: true,
    royaltyFee: 5,
    mintStartDate: "2026-07-10T16:00:00Z",
    totalVolume: 84000,
    contractAddress: "0x331048123901A83719829034E2019A1009772844",
  },
  {
    id: "col-12",
    name: "BioGene Alpha Pass",
    symbol: "GENE",
    description: "Exclusive whitelist pass for future biotech RWA drops and governance voting.",
    bannerImage: COLLECTION_IMAGES.col12.banner,
    featuredImage: COLLECTION_IMAGES.col12.featured,
    creatorName: "CyberPunk Studio",
    creatorAvatar: COLLECTION_IMAGES.col12.featured,
    creatorAddress: "0x3F2819C1048700201991823901A8371982D11C8",
    mintPrice: 50,
    maxSupply: 800,
    mintedSupply: 800,
    category: "Utility",
    status: "Ended",
    isVerified: false,
    royaltyFee: 2,
    mintStartDate: "2026-05-15T12:00:00Z",
    totalVolume: 40000,
    contractAddress: "0x441048123901A83719829034E2019A1009772855",
  },
];

export const MOCK_STATS = {
  collectionsCreated: 1420,
  nftsMinted: 489320,
  activeCreators: 24800,
  totalVolumeUsdc: 12450000,
};

export const MOCK_PARTNERS = [
  { name: "ARC Network", logo: "ARC", icon: "Hexagon" },
  { name: "Circle USDC", logo: "Circle", icon: "DollarSign" },
  { name: "MetaMask", logo: "MetaMask", icon: "Shield" },
  { name: "WalletConnect", logo: "WalletConnect", icon: "Zap" },
  { name: "IPFS Storage", logo: "IPFS", icon: "HardDrive" },
  { name: "Pinata Cloud", logo: "Pinata", icon: "Cloud" },
];

export const MOCK_HOW_IT_WORKS = [
  {
    step: "01",
    title: "Connect Wallet",
    description: "Link your Web3 wallet and get Circle Testnet USDC to mint collections on ARC Network.",
    icon: "Wallet",
  },
  {
    step: "02",
    title: "Create Collection",
    description: "Define collection metadata, royalties, and set mint pricing in Circle Testnet USDC.",
    icon: "Layers",
  },
  {
    step: "03",
    title: "Upload NFT Assets",
    description: "Batch upload high-resolution media & artwork directly to decentralized IPFS via automated Pinata integration.",
    icon: "UploadCloud",
  },
  {
    step: "04",
    title: "Deploy Collection",
    description: "Deploy gas-optimized ERC-721A smart contract on ARC Network with audited security standards.",
    icon: "Rocket",
  },
  {
    step: "05",
    title: "Start Minting",
    description: "Share your launchpad link and receive real-time Circle Testnet USDC primary mint sales & royalties.",
    icon: "Sparkles",
  },
];

export const MOCK_FEATURES = [
  {
    title: "Circle USDC Transactions",
    description: "Seamless primary NFT mints and secondary royalties processed using Circle Testnet USDC.",
    icon: "DollarSign",
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
  {
    title: "No-Code Collection Builder",
    description: "Configure royalties, presale pricing in USDC, and delayed reveals effortlessly.",
    icon: "Wand2",
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
  {
    title: "ARC L2 Sub-second Speed",
    description: "Sub-second transaction finality with minimal ARC gas fees for Circle USDC transfers.",
    icon: "Cpu",
    gradient: "from-purple-500/20 to-blue-500/20",
  },
  {
    title: "Automated IPFS Pinning",
    description: "Permanent metadata and artwork storage backed by multi-region IPFS redundancy.",
    icon: "Database",
    gradient: "from-blue-500/20 to-teal-500/20",
  },
  {
    title: "Audited Smart Contracts",
    description: "Built-in ERC-721A gas optimization, anti-bot protection, and multi-sig security standard by default.",
    icon: "ShieldCheck",
    gradient: "from-emerald-500/20 to-blue-500/20",
  },
  {
    title: "USDC Creator Revenue Analytics",
    description: "Real-time analytics tracking floor price, USDC volume, holders distribution, and automatic payout claims.",
    icon: "BarChart3",
    gradient: "from-amber-500/20 to-purple-500/20",
  },
];
