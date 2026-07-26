import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createCollectionSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "Popular";
    const creatorAddress = searchParams.get("creatorAddress");

    // Build Prisma query filter
    const where: any = {};

    if (category && category !== "All") {
      where.category = category;
    }

    if (status && status !== "All") {
      if (status === "Live") {
        where.status = "Live Minting";
      } else {
        where.status = status;
      }
    }

    if (creatorAddress) {
      where.creatorAddress = creatorAddress.toLowerCase();
    }

    if (search && search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { symbol: { contains: q } },
        { creator: { name: { contains: q } } },
      ];
    }

    // Build Prisma orderBy
    let orderBy: any = { totalVolume: "desc" };
    if (sortBy === "Newest") {
      orderBy = { mintStartDate: "desc" };
    } else if (sortBy === "PriceAsc") {
      orderBy = { mintPrice: "asc" };
    } else if (sortBy === "PriceDesc") {
      orderBy = { mintPrice: "desc" };
    } else if (sortBy === "Supply") {
      orderBy = { maxSupply: "desc" };
    } else if (sortBy === "Alphabetical") {
      orderBy = { name: "asc" };
    }

    const collections = await prisma.collection.findMany({
      where,
      orderBy,
      include: {
        creator: {
          select: {
            name: true,
            handle: true,
            avatar: true,
            address: true,
            isVerified: true,
          },
        },
      },
    });

    // Format response to match NFTCollection interface
    const formattedCollections = collections.map((col) => ({
      id: col.id,
      name: col.name,
      symbol: col.symbol,
      description: col.description,
      bannerImage: col.bannerImage,
      featuredImage: col.featuredImage,
      creatorName: col.creator?.name || "Anonymous Creator",
      creatorAvatar: col.creator?.avatar || col.featuredImage,
      creatorAddress: col.creatorAddress,
      mintPrice: col.mintPrice,
      maxSupply: col.maxSupply,
      mintedSupply: col.mintedSupply,
      category: col.category as any,
      status: col.status as any,
      isVerified: col.isVerified,
      royaltyFee: col.royaltyFee,
      mintStartDate: col.mintStartDate.toISOString(),
      totalVolume: col.totalVolume,
      contractAddress: col.contractAddress,
      featuredOrder: col.featuredOrder || 0,
    }));

    return NextResponse.json({ success: true, collections: formattedCollections });
  } catch (error: any) {
    console.error("GET /api/collections error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch collections from database" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Zod payload validation
    const validatedData = createCollectionSchema.parse(body);

    const creatorAddr = validatedData.creatorAddress.toLowerCase();

    // 2. Upsert creator user in database
    await prisma.user.upsert({
      where: { address: creatorAddr },
      update: {},
      create: {
        address: creatorAddr,
        name: `Creator ${creatorAddr.slice(0, 6)}`,
        usdcBalance: 1000.0,
        gasBalance: 100.0,
      },
    });

    // 3. Generate random realistic mock contract address
    const randomContractAddr = `0x${Math.random().toString(16).substring(2, 42).padStart(40, "0")}`;

    // 4. Create Collection in Database
    const newCol = await prisma.collection.create({
      data: {
        name: validatedData.name,
        symbol: validatedData.symbol,
        description: validatedData.description,
        category: validatedData.category,
        bannerImage: validatedData.bannerImage,
        featuredImage: validatedData.featuredImage,
        creatorAddress: creatorAddr,
        mintPrice: validatedData.mintPrice,
        maxSupply: validatedData.maxSupply,
        mintedSupply: 0,
        status: "Live Minting",
        isVerified: true,
        royaltyFee: validatedData.royaltyFee,
        contractAddress: randomContractAddr,
        totalVolume: 0,
      },
      include: {
        creator: true,
      },
    });

    // 5. Trigger cache revalidation across routes
    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath("/collections");

    return NextResponse.json({ success: true, collection: newCol }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/collections error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create collection in database" },
      { status: 400 }
    );
  }
}
