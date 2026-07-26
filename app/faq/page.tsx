"use client";

import React, { useState } from "react";
import { HelpCircle, Search, ChevronDown, ChevronUp, ExternalLink, Droplet } from "lucide-react";
import { useWallet } from "@/components/web3/WalletContext";

export default function FAQPage() {
  const { circleFaucetUrl } = useWallet();
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What currency is used for NFT mints and marketplace trades?",
      answer:
        "All NFT primary mints, collection pricing, marketplace trades, and creator royalty payouts on ARC NFT Launchpad use Circle Testnet USDC (6 decimals) as the primary currency.",
      category: "Currency",
    },
    {
      question: "How do network gas fees work on ARC Network?",
      answer:
        "While NFT transactions are priced in Circle USDC, network transaction gas fees are paid using ARC Network's native gas token (ARC). This guarantees sub-second finality and near-zero gas costs (~0.0012 ARC per mint).",
      category: "Gas Fees",
    },
    {
      question: "Where can I get free Circle Testnet USDC?",
      answer:
        "You can request free testnet USDC from the official Circle Testnet Faucet at https://faucet.circle.com/. Simply paste your connected Web3 address and receive testnet USDC instantly.",
      category: "Faucet",
    },
    {
      question: "How do I launch an NFT collection without writing smart contracts?",
      answer:
        "Simply navigate to the Launch page, complete our 4-step wizard (Collection info, artwork uploads, USDC mint pricing, and sale settings), and click Deploy. Our automated builder compiles gas-optimized ERC-721A smart contracts and pins artwork to IPFS automatically.",
      category: "Creators",
    },
    {
      question: "Which Web3 wallets are supported on ARC Network?",
      answer:
        "We support MetaMask, WalletConnect, Coinbase Wallet, and any EVM-compatible Web3 wallet configured for ARC Network RPC endpoints.",
      category: "Wallets",
    },
    {
      question: "How are royalties paid out to creators?",
      answer:
        "Royalty fees (set between 0% to 10%) are automatically enforced on secondary transfers on supported ARC marketplaces and can be claimed directly from your Creator Dashboard in Circle Testnet USDC.",
      category: "Creators",
    },
    {
      question: "How does IPFS metadata storage work?",
      answer:
        "When you upload your media during the launch wizard, your artwork and JSON metadata are pinned across decentralized IPFS nodes powered by Pinata redundancy, ensuring permanent tamper-proof storage.",
      category: "Technical",
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-mono font-bold">
            <HelpCircle className="h-3.5 w-3.5" /> Support & FAQ Center
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
            Everything you need to know about Circle USDC minting, ARC gas fees, and launching Web3 collections.
          </p>
        </div>

        {/* Faucet Callout Box */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-sky-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
              <Droplet className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Need Testnet USDC for Minting?</h4>
              <p className="text-xs text-slate-600">Claim free testnet USDC from the official Circle Faucet.</p>
            </div>
          </div>
          <a
            href={circleFaucetUrl}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
          >
            Circle Faucet <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Search Filter */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions (e.g. USDC, gas fees, royalties, IPFS...)"
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-md"
          />
        </div>

        {/* Accordion List */}
        <div className="space-y-4 pt-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base hover:text-blue-600 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                      {faq.category}
                    </span>
                    {faq.question}
                  </span>
                  {isOpen ? <ChevronUp className="h-5 w-5 text-blue-600" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
