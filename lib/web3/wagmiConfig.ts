import { http, createConfig } from "wagmi";
import { metaMask, coinbaseWallet, injected } from "wagmi/connectors";
import { arcChain, WEB3_CONFIG } from "./config";

export const wagmiConfig = createConfig({
  chains: [arcChain],
  connectors: [
    metaMask({
      dappMetadata: {
        name: "ARC NFT Launchpad",
        url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      },
    }),
    coinbaseWallet({
      appName: "ARC NFT Launchpad",
    }),
    injected({
      target: "metaMask",
      shimDisconnect: true,
    }),
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [arcChain.id]: http(WEB3_CONFIG.rpcUrl),
  },
  ssr: true,
});
