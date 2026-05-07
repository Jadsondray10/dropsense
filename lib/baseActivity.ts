import { createPublicClient, http, formatEther } from "viem";
import { base } from "viem/chains";

export interface ProtocolUsage {
  name: string;
  type: "dex" | "bridge" | "nft" | "defi";
  interactionCount: number;
}

export interface WalletActivity {
  wallet: string;
  chain: "base";
  metrics: {
    transactionCount: number;
    uniqueProtocols: number;
    totalVolumeETH: number;
    firstTxDate: number | null;
    lastTxDate: number | null;
  };
  activity: {
    swaps: number;
    bridges: number;
    nftInteractions: number;
    defiActions: number;
  };
  protocolsUsed: ProtocolUsage[];
  airdropScore: number;
}

export interface RawTransaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  input: string;
  timeStamp: string;
  isError: string;
}

const PROTOCOLS: Record<string, { name: string; type: "dex" | "bridge" | "nft" | "defi" }> = {
  "0x2626664c2603336e57b271c5c0b26f421741e481": { name: "Uniswap V3", type: "dex" },
  "0x198ef1ec325a96cc354c7266a038be8b5c558f67": { name: "Uniswap UniversalRouter", type: "dex" },
  "0x8c1a3cf8f83074169fe5d7ad50b978e1cda14646": { name: "Aerodrome", type: "dex" },
  "0xcf77a3ba9a5ca399b7c97c74d54e5b1beb874e43": { name: "Aerodrome Router", type: "dex" },
  "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24": { name: "SushiSwap", type: "dex" },
  "0x6131b5fae19ea4f9d964eac0408e4408b66337b5": { name: "KyberSwap", type: "dex" },
  "0x3154cf16ccdb4c6d922629664174b904d80f2c35": { name: "Base Bridge", type: "bridge" },
  "0x49048044d57e1c92a77f79988d21fa8faf74e97e": { name: "Base Bridge L1", type: "bridge" },
  "0x4200000000000000000000000000000000000010": { name: "Base L2 Bridge", type: "bridge" },
  "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae": { name: "LI.FI Bridge", type: "bridge" },
  "0x00000000000111abe46ff893f3b2fdf1f759a8a8": { name: "Seaport (OpenSea)", type: "nft" },
  "0xd4307e0acd12cf46fd6cf93bc264f5d5d1598792": { name: "Zora", type: "nft" },
  "0x777777722d078c97c6ad07d9f36801e653e356ae": { name: "Zora Mints", type: "nft" },
  "0x58c3ccb2dcb9384e5ab9111cd1a5dea916b0f33c": { name: "Highlight", type: "nft" },
  "0xa238cbeb142c10ef7ad8442c6d1f9e89e07e7761": { name: "Morpho Blue", type: "defi" },
  "0x18cd499e3d7ed42feba981ac9236a278e4cdc2ee": { name: "Moonwell", type: "defi" },
  "0x9c3b46c0ceb5b9e304fcd6d88fc50f7dd24b31bc": { name: "Extra Finance", type: "defi" },
};

const METHOD_SIGNATURES: Record<string, "swap" | "bridge" | "nft" | "defi"> = {
  "0x38ed1739": "swap",
  "0x7ff36ab5": "swap",
  "0x18cbafe5": "swap",
  "0x04e45aaf": "swap",
  "0xb858183f": "swap",
  "0x3593564c": "swap",
  "0x12aa3caf": "swap",
  "0x56688700": "bridge",
  "0xb1a1a882": "bridge",
  "0x9a2ac6d5": "bridge",
  "0x1249c58b": "nft",
  "0xa0712d68": "nft",
  "0x40c10f19": "nft",
  "0x6a627842": "nft",
  "0x23b872dd": "nft",
  "0x42842e0e": "nft",
  "0xe2bbb158": "defi",
  "0x441a3e70": "defi",
  "0xd0e30db0": "defi",
  "0x2e1a7d4d": "defi",
  "0xb6b55f25": "defi",
  "0xa694fc3a": "defi",
};

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org"),
});

async function fetchTransactions(address: string): Promise<RawTransaction[]> {
  const baseUrl = "https://base.blockscout.com/api/v2/addresses/" + address + "/transactions";

  let allTxs: RawTransaction[] = [];
  let nextPageParams = "";

  while (true) {
    const url = nextPageParams ? baseUrl + "?" + nextPageParams : baseUrl;

    const res = await fetch(url);
    if (!res.ok) throw new Error("API error: " + res.status);

    const json = await res.json();

    if (!json.items || json.items.length === 0) break;

    const txs: RawTransaction[] = json.items
      .filter((tx: any) => tx.status === "ok")
      .map((tx: any) => ({
        hash: tx.hash,
        from: tx.from?.hash || "",
        to: tx.to?.hash || "",
        value: tx.value || "0",
        input: tx.raw_input || "0x",
        timeStamp: String(Math.floor(new Date(tx.timestamp).getTime() / 1000)),
        isError: tx.status === "ok" ? "0" : "1",
      }));

    allTxs = allTxs.concat(txs);

    if (!json.next_page_params || allTxs.length >= 1000) break;

    const p = json.next_page_params;
    nextPageParams = Object.keys(p).map(k => k + "=" + p[k]).join("&");
  }

  return allTxs;
}

function classifyTransaction(tx: RawTransaction): {
  category: "swap" | "bridge" | "nft" | "defi" | "transfer" | "unknown";
  protocolKey: string | null;
} {
  const toAddr = tx.to?.toLowerCase() ?? "";
  const methodSig = tx.input?.slice(0, 10).toLowerCase() ?? "";

  if (PROTOCOLS[toAddr]) {
    const proto = PROTOCOLS[toAddr];
    const cat = proto.type === "dex" ? "swap" : proto.type;
    return { category: cat, protocolKey: toAddr };
  }

  if (METHOD_SIGNATURES[methodSig]) {
    return { category: METHOD_SIGNATURES[methodSig], protocolKey: null };
  }

  if (tx.input === "0x" && BigInt(tx.value) > BigInt(0)) {
    return { category: "transfer", protocolKey: null };
  }

  return { category: "unknown", protocolKey: null };
}

export async function getBaseWalletActivity(address: string): Promise<WalletActivity> {
  const normalizedAddr = address.toLowerCase();
  const txs = await fetchTransactions(normalizedAddr);

  if (txs.length === 0) {
    return buildEmptyActivity(address);
  }

  let totalVolumeWei = BigInt(0);
  const protocolCounts: Record<string, number> = {};
  const categoryCounts = { swaps: 0, bridges: 0, nftInteractions: 0, defiActions: 0 };

  for (const tx of txs) {
    totalVolumeWei += BigInt(tx.value);
    const { category, protocolKey } = classifyTransaction(tx);

    if (category === "swap") categoryCounts.swaps++;
    else if (category === "bridge") categoryCounts.bridges++;
    else if (category === "nft") categoryCounts.nftInteractions++;
    else if (category === "defi") categoryCounts.defiActions++;

    if (protocolKey) {
      protocolCounts[protocolKey] = (protocolCounts[protocolKey] || 0) + 1;
    }
  }

  const protocolsUsed: ProtocolUsage[] = Object.entries(protocolCounts)
    .map(([addr, count]) => {
      const proto = PROTOCOLS[addr];
      return {
        name: proto.name,
        type: proto.type,
        interactionCount: count,
      } as ProtocolUsage;
    })
    .sort((a, b) => b.interactionCount - a.interactionCount);

  const timestamps = txs.map((tx) => parseInt(tx.timeStamp));
  const firstTxDate = Math.min(...timestamps);
  const lastTxDate = Math.max(...timestamps);

  const walletData: WalletActivity = {
    wallet: address,
    chain: "base",
    metrics: {
      transactionCount: txs.length,
      uniqueProtocols: protocolsUsed.length,
      totalVolumeETH: parseFloat(formatEther(totalVolumeWei)),
      firstTxDate,
      lastTxDate,
    },
    activity: categoryCounts,
    protocolsUsed,
    airdropScore: 0,
  };

  walletData.airdropScore = calculateAirdropScore(walletData);
  return walletData;
}

export function calculateAirdropScore(data: WalletActivity): number {
  let score = 0;
  const { metrics, activity, protocolsUsed } = data;

  const txScore = Math.min(20, Math.log10(metrics.transactionCount + 1) * 10);
  score += txScore;

  const protoScore = Math.min(25, protocolsUsed.length * 5);
  score += protoScore;

  const activeTypes = [
    activity.swaps > 0,
    activity.bridges > 0,
    activity.nftInteractions > 0,
    activity.defiActions > 0,
  ].filter(Boolean).length;
  score += activeTypes * 5;

  if (metrics.lastTxDate) {
    const daysSinceLastTx = (Date.now() / 1000 - metrics.lastTxDate) / 86400;
    const recencyScore = Math.max(0, 20 - (daysSinceLastTx / 365) * 20);
    score += recencyScore;
  }

  if (metrics.firstTxDate) {
    const ageInDays = (Date.now() / 1000 - metrics.firstTxDate) / 86400;
    const ageScore = Math.min(15, (ageInDays / 365) * 15);
    score += ageScore;
  }

  return Math.round(Math.min(100, score));
}

function buildEmptyActivity(address: string): WalletActivity {
  return {
    wallet: address,
    chain: "base",
    metrics: {
      transactionCount: 0,
      uniqueProtocols: 0,
      totalVolumeETH: 0,
      firstTxDate: null,
      lastTxDate: null,
    },
    activity: { swaps: 0, bridges: 0, nftInteractions: 0, defiActions: 0 },
    protocolsUsed: [],
    airdropScore: 0,
  };
}