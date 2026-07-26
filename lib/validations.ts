import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().min(2, "Collection name must be at least 2 characters").max(50),
  symbol: z.string().min(2, "Symbol must be 2-10 characters").max(10),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  category: z.enum(["Art", "Gaming", "PFP", "Music", "RWA", "Utility"]),
  mintPrice: z.number().min(0, "Mint price cannot be negative"),
  maxSupply: z.number().int().positive("Max supply must be greater than 0"),
  royaltyFee: z.number().min(0).max(15, "Royalty fee max is 15%"),
  bannerImage: z.string().url("Banner image must be a valid URL or Data URI"),
  featuredImage: z.string().url("Featured image must be a valid URL or Data URI"),
  creatorAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format"),
});

export const mintNftSchema = z.object({
  collectionId: z.string().min(1, "Collection ID is required"),
  minterAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid minter wallet address"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(10, "Max 10 per transaction"),
});
