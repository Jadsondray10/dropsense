"use client";

import { useState } from "react";
import { useBaseActivity } from "@/hooks/useBaseActivity";

function formatDate(ts: number | null): string {
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatETH(val: number): string {
  if (val === 0) return "0 ETH";
  if (val < 0.0001) return "< 0.0001 ETH";
  return val.toFixed(4) + " ETH";
}

function timeAgo(ts: number | null): string {
  if (!ts) return "Never";
  const seconds = Math.floor(Date.now() / 1000 - ts);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
  if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
  if (seconds < 2592000) return Math.floor(seconds / 86400) + "d ago";
  return Math.floor(seconds / 2592000) + "mo ago";
}

function scoreColor(score: number): string {
  if (score >= 75) return "#00ff9d";
  if (score >= 50) return "#f0c040";
  if (score >= 25) return "#ff9a3c";
  return "#ff4d4d";
}

function scoreLabel(score: number): string {
  if (score >= 75) return "PRIME";
  if (score >= 50) return "ACTIVE";
  if (score >= 25) return "LIGHT";
  return "COLD";
}

function shortAddress(address: string): string {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

const PROTOCOL_TYPE_COLORS: Record<string, string> = {
  dex: "#3b82f6",
  bridge: "#a855f7",
  nft: "#ec4899",
  defi: "#10b981",
};

function MetricCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div style={styles.metricCell}>
      <span style={styles.metricLabel}>{label}</span>
      <span style={{ ...styles.metricValue, color: accent || "#e2e8f0" }}>
        {value}
      </span>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = scoreColor(score);
  return (
    <div style={styles.scoreRingContainer}>
      <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={progress + " " + circumference}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div style={styles.scoreInner}>
        <span style={{ ...styles.scoreNumber, color }}>{score}</span>
        <span style={{ ...styles.scoreLbl, color }}>{scoreLabel(score)}</span>
      </div>
    </div>
  );
}

function ActivityBar({
  label, count, max, color,
}: {
  label: string; count: number; max: number; color: string;
}) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div style={styles.activityRow}>
      <span style={styles.activityLabel}>{label}</span>
      <div style={styles.barTrack}>
        <div style={{ ...styles.barFill, width: pct + "%", backgroundColor: color }} />
      </div>
      <span style={{ ...styles.activityCount, color }}>{count}</span>
    </div>
  );
}

interface BaseActivityCardProps {
  address: string;
}

export function BaseActivityCard({ address }: BaseActivityCardProps) {
  const { data, loading, error, refetch } = useBaseActivity(address);
  const [expanded, setExpanded] = useState(false);
  const shortAddr = address ? shortAddress(address) : "—";

  if (loading) {
    return (
      <div style={styles.card}>
        <div style={styles.stateContainer}>
          <div style={styles.pulse} />
          <div style={styles.loadingText}>SCANNING BASE CHAIN</div>
          <div style={styles.loadingAddr}>{shortAddr}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.card}>
        <div style={styles.stateContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <div style={styles.errorMsg}>{error}</div>
          <button style={styles.retryBtn} onClick={refetch}>RETRY</button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { metrics, activity, protocolsUsed, airdropScore } = data;
  const maxActivity = Math.max(
    activity.swaps,
    activity.bridges,
    activity.nftInteractions,
    activity.defiActions,
    1
  );

  const visibleProtocols = expanded ? protocolsUsed : protocolsUsed.slice(0, 3);

  return (
    <div style={styles.card}>

      <div style={styles.header}>
        <div style={styles.chainBadge}>
          <span style={styles.chainDot} />
          BASE
        </div>
        <div style={styles.walletAddress}>{shortAddr}</div>
        <button style={styles.refreshBtn} onClick={refetch}>↻</button>
      </div>

      <div style={styles.topSection}>
        <ScoreRing score={airdropScore} />
        <div style={styles.keyMetrics}>
          <MetricCell label="TRANSACTIONS" value={metrics.transactionCount.toLocaleString()} />
          <MetricCell label="PROTOCOLS" value={metrics.uniqueProtocols} accent="#3b82f6" />
          <MetricCell label="VOLUME" value={formatETH(metrics.totalVolumeETH)} accent="#a78bfa" />
          <MetricCell label="LAST ACTIVE" value={timeAgo(metrics.lastTxDate)} accent={scoreColor(airdropScore)} />
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.section}>
        <div style={styles.sectionTitle}>ACTIVITY BREAKDOWN</div>
        <ActivityBar label="SWAPS" count={activity.swaps} max={maxActivity} color="#3b82f6" />
        <ActivityBar label="BRIDGES" count={activity.bridges} max={maxActivity} color="#a855f7" />
        <ActivityBar label="NFTs" count={activity.nftInteractions} max={maxActivity} color="#ec4899" />
        <ActivityBar label="DEFI" count={activity.defiActions} max={maxActivity} color="#10b981" />
      </div>

      <div style={styles.divider} />

      {protocolsUsed.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            PROTOCOLS USED
            {protocolsUsed.length > 3 && (
              <button style={styles.expandBtn} onClick={() => setExpanded(!expanded)}>
                {expanded ? "SHOW LESS" : "+" + (protocolsUsed.length - 3) + " MORE"}
              </button>
            )}
          </div>
          <div style={styles.protocolGrid}>
            {visibleProtocols.map((proto) => (
              <div key={proto.name} style={styles.protocolChip}>
                <span style={{ ...styles.protocolDot, backgroundColor: PROTOCOL_TYPE_COLORS[proto.type] || "#64748b" }} />
                <span style={styles.protocolName}>{proto.name}</span>
                <span style={styles.protocolCount}>x{proto.interactionCount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.footer}>
        <span style={styles.footerItem}>FIRST TX: {formatDate(metrics.firstTxDate)}</span>
        <span style={styles.footerItem}>LAST TX: {formatDate(metrics.lastTxDate)}</span>
      </div>

    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "linear-gradient(135deg, #0a0f1e 0%, #0d1526 50%, #0a0f1e 100%)",
    border: "1px solid #1e3a5f",
    borderRadius: "12px",
    padding: "24px",
    fontFamily: "monospace",
    color: "#94a3b8",
    maxWidth: "480px",
    width: "100%",
    boxShadow: "0 0 40px rgba(59,130,246,0.08), 0 4px 24px rgba(0,0,0,0.5)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  chainBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(59,130,246,0.1)",
    border: "1px solid rgba(59,130,246,0.3)",
    borderRadius: "4px",
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#3b82f6",
    letterSpacing: "2px",
  },
  chainDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#00ff9d",
    boxShadow: "0 0 6px #00ff9d",
    display: "inline-block",
  },
  walletAddress: { fontSize: "12px", color: "#64748b", letterSpacing: "1px" },
  refreshBtn: {
    background: "none",
    border: "1px solid #1e3a5f",
    color: "#3b82f6",
    borderRadius: "4px",
    padding: "4px 8px",
    cursor: "pointer",
    fontSize: "16px",
    lineHeight: 1,
  },
  topSection: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    marginBottom: "20px",
  },
  scoreRingContainer: {
    position: "relative",
    width: "100px",
    height: "100px",
    flexShrink: 0,
  },
  scoreInner: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2px",
  },
  scoreNumber: { fontSize: "24px", fontWeight: "700", lineHeight: 1 },
  scoreLbl: { fontSize: "9px", fontWeight: "700", letterSpacing: "2px" },
  keyMetrics: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    flex: 1,
  },
  metricCell: { display: "flex", flexDirection: "column", gap: "4px" },
  metricLabel: { fontSize: "9px", color: "#475569", letterSpacing: "1.5px", fontWeight: "600" },
  metricValue: { fontSize: "14px", fontWeight: "600", color: "#e2e8f0" },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, #1e3a5f 30%, #1e3a5f 70%, transparent)",
    marginBottom: "16px",
  },
  section: { marginBottom: "16px" },
  sectionTitle: {
    fontSize: "10px",
    color: "#475569",
    letterSpacing: "2px",
    fontWeight: "700",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" },
  activityLabel: { fontSize: "10px", letterSpacing: "1px", color: "#64748b", width: "56px", flexShrink: 0 },
  barTrack: { flex: 1, height: "4px", backgroundColor: "#1e293b", borderRadius: "2px", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: "2px", transition: "width 0.8s ease" },
  activityCount: { fontSize: "11px", fontWeight: "700", width: "28px", textAlign: "right", flexShrink: 0 },
  protocolGrid: { display: "flex", flexDirection: "column", gap: "6px" },
  protocolChip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(30,58,95,0.3)",
    border: "1px solid #1e3a5f",
    borderRadius: "6px",
    padding: "6px 10px",
  },
  protocolDot: { width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0 },
  protocolName: { fontSize: "11px", color: "#cbd5e1", flex: 1 },
  protocolCount: { fontSize: "10px", color: "#475569" },
  expandBtn: {
    background: "none",
    border: "none",
    color: "#3b82f6",
    fontSize: "9px",
    letterSpacing: "1px",
    cursor: "pointer",
    padding: 0,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "4px",
    paddingTop: "12px",
    borderTop: "1px solid #0f172a",
  },
  footerItem: { fontSize: "9px", color: "#334155", letterSpacing: "1px" },
  stateContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "40px 0",
  },
  pulse: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "2px solid #3b82f6",
    borderTopColor: "transparent",
  },
  loadingText: { fontSize: "11px", letterSpacing: "3px", color: "#3b82f6" },
  loadingAddr: { fontSize: "10px", color: "#334155" },
  errorIcon: { fontSize: "28px", color: "#ff4d4d" },
  errorMsg: { fontSize: "12px", color: "#94a3b8", textAlign: "center" },
  retryBtn: {
    background: "rgba(255,77,77,0.1)",
    border: "1px solid rgba(255,77,77,0.3)",
    color: "#ff4d4d",
    borderRadius: "4px",
    padding: "6px 16px",
    cursor: "pointer",
    fontSize: "11px",
    letterSpacing: "2px",
  },
};

export function BaseActivityCardDemo() {
  const [address, setAddress] = useState("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
  const [submitted, setSubmitted] = useState(address);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060a14",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "24px",
      padding: "32px 16px",
      fontFamily: "monospace",
    }}>
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <h1 style={{ color: "#3b82f6", fontSize: "20px", letterSpacing: "4px", margin: 0, fontWeight: 700 }}>
          DROP<span style={{ color: "#00ff9d" }}>SENSE</span>
        </h1>
        <p style={{ color: "#334155", fontSize: "10px", letterSpacing: "3px", margin: "6px 0 0" }}>
          BASE CHAIN ACTIVITY SCANNER
        </p>
      </div>

      <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "480px" }}>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x..."
          style={{
            flex: 1,
            background: "#0d1526",
            border: "1px solid #1e3a5f",
            borderRadius: "6px",
            color: "#e2e8f0",
            padding: "10px 14px",
            fontSize: "12px",
            fontFamily: "inherit",
            outline: "none",
          }}
        />
        <button
          onClick={() => setSubmitted(address)}
          style={{
            background: "#3b82f6",
            border: "none",
            borderRadius: "6px",
            color: "#fff",
            padding: "10px 16px",
            cursor: "pointer",
            fontSize: "11px",
            letterSpacing: "1px",
            fontFamily: "inherit",
            fontWeight: 700,
          }}
        >
          SCAN
        </button>
      </div>

      <BaseActivityCard address={submitted} />
    </div>
  );
}