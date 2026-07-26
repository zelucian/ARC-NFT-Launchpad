import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/components/web3/Web3Provider";
import { WalletProvider } from "@/components/web3/WalletContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConnectWalletModal } from "@/components/web3/ConnectWalletModal";

export const metadata: Metadata = {
  title: "ARC NFT Launchpad | Create & Launch Web3 NFT Collections on ARC Network",
  description:
    "The premier no-code Web3 NFT creation and launch platform on ARC Network. Deploy audited ERC-721A smart contracts, host media on IPFS, and manage presale whitelists with ease.",
  keywords: [
    "ARC Network",
    "NFT Launchpad",
    "Web3",
    "ERC-721A",
    "Smart Contract Builder",
    "Crypto",
    "Digital Art",
    "No-Code NFT",
  ],
  authors: [{ name: "ARC Launchpad Team" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "ARC NFT Launchpad - Launch Collections on ARC Network",
    description: "Create, deploy, and manage Web3 NFT collections without coding.",
    url: "https://launchpad.arc.network",
    siteName: "ARC NFT Launchpad",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className="bg-[#f8fafc] text-slate-900 antialiased selection:bg-blue-600 selection:text-white min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        <Web3Provider>
          <WalletProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ConnectWalletModal />
          </WalletProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
