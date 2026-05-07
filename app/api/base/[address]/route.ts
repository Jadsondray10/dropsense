import { NextRequest, NextResponse } from "next/server";
import { getBaseWalletActivity } from "@/lib/baseActivity";
import { isAddress } from "viem";

const cache = new Map<string, { data: unknown; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function GET(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  const { address } = await params;

  if (!address) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  if (!isAddress(address)) {
    return NextResponse.json(
      { error: "Invalid Ethereum address format" },
      { status: 400 }
    );
  }

  const cacheKey = address.toLowerCase();
  const cached = cache.get(cacheKey);

  if (cached && Date.now() < cached.expiresAt) {
    return NextResponse.json(cached.data, {
      headers: { "X-Cache": "HIT" },
    });
  }

  try {
    const activity = await getBaseWalletActivity(address);

    cache.set(cacheKey, {
      data: activity,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return NextResponse.json(activity, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (err: unknown) {
    console.error("Failed to fetch activity for " + address, err);

    const message =
      err instanceof Error ? err.message : "Failed to fetch wallet activity";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}