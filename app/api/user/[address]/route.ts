import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const lowerAddress = address.toLowerCase();

    // Fetch user or upsert default record
    let user = await prisma.user.findUnique({
      where: { address: lowerAddress },
      include: {
        collections: {
          include: {
            mints: true,
          },
        },
        mints: {
          include: {
            collection: true,
          },
          orderBy: {
            mintedAt: "desc",
          },
        },
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          address: lowerAddress,
          name: `Creator ${lowerAddress.slice(0, 6)}`,
          usdcBalance: 1425.0,
          gasBalance: 142.5,
        },
        include: {
          collections: {
            include: {
              mints: true,
            },
          },
          mints: {
            include: {
              collection: true,
            },
            orderBy: {
              mintedAt: "desc",
            },
          },
        },
      });
    }

    // Compute Creator Stats directly from Database
    const totalVolume = user.collections.reduce((sum, col) => sum + col.totalVolume, 0);
    const totalRevenue = totalVolume * 0.95; // 95% revenue net of platform fee
    const totalMints = user.collections.reduce((sum, col) => sum + col.mintedSupply, 0);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        address: user.address,
        name: user.name,
        handle: user.handle,
        avatar: user.avatar,
        usdcBalance: user.usdcBalance,
        gasBalance: user.gasBalance,
        isVerified: user.isVerified,
        totalCollections: user.collections.length,
        totalVolume,
        totalRevenue,
        totalMints,
        collections: user.collections,
        mints: user.mints,
      },
    });
  } catch (error: any) {
    console.error("GET /api/user/[address] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user data from database" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const lowerAddress = address.toLowerCase();

    const user = await prisma.user.upsert({
      where: { address: lowerAddress },
      update: {},
      create: {
        address: lowerAddress,
        name: `User ${lowerAddress.slice(0, 6)}`,
        usdcBalance: 1425.0,
        gasBalance: 142.5,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("POST /api/user/[address] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync user session in database" },
      { status: 500 }
    );
  }
}
