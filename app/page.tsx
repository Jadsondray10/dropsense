"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { BaseActivityCard } from "@/components/BaseActivityCard";
import Link from "next/link";

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060a14",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "28px",
      padding: "32px 16px",
      fontFamily: "monospace",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background grid */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      {/* Top accent line */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: "2px",
        background: "linear-gradient(90deg, transparent, #3b82f6, #00ff9d, transparent)",
      }} />

      {/* Logo */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "11px", letterSpacing: "6px", color: "#334155", marginBottom: "12px" }}>
          INTELLIGENCE FOR AIRDROP HUNTERS
        </div>
        <h1 style={{ margin: 0, lineHeight: 1 }}>
          <span style={{ fontSize: "48px", fontWeight: "700", color: "#3b82f6", letterSpacing: "8px" }}>DROP</span>
          <span style={{ fontSize: "48px", fontWeight: "700", color: "#00ff9d", letterSpacing: "8px" }}>SENSE</span>
        </h1>
        <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#1e3a5f", marginTop: "8px" }}>
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        </div>
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#475569", marginTop: "8px" }}>
          TRACK · ANALYZE · EARN
        </div>
      </div>

      {/* Connect button */}
      <ConnectButton />

      {/* Projects button */}
      <Link href="/projects" style={{
        textDecoration: "none",
        color: "#00ff9d",
        fontSize: "11px",
        letterSpacing: "3px",
        border: "1px solid #00ff9d33",
        padding: "10px 24px",
        borderRadius: "6px",
        background: "rgba(0,255,157,0.05)",
        transition: "all 0.2s",
      }}>
        VIEW AIRDROP PROJECTS →
      </Link>

      {/* Activity card */}
      {isConnected && address && (
        <BaseActivityCard address={address} />
      )}

      {!isConnected && (
        <div style={{
          border: "1px solid #1e3a5f",
          borderRadius: "12px",
          padding: "32px 40px",
          textAlign: "center",
          maxWidth: "480px",
          width: "100%",
          background: "rgba(10,15,30,0.8)",
        }}>
          <div style={{ fontSize: "24px", marginBottom: "12px" }}>⬡</div>
          <div style={{ color: "#475569", fontSize: "11px", letterSpacing: "2px", lineHeight: 2 }}>
            CONNECT YOUR WALLET<br/>TO SCAN YOUR BASE ACTIVITY<br/>AND TRACK AIRDROP TASKS
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        position: "fixed",
        bottom: "16px",
        textAlign: "center",
        fontSize: "9px",
        letterSpacing: "2px",
        color: "#1e3a5f",
      }}>
        BUILT ON GENLAYER · BY{" "}
        <a href="https://twitter.com/jadsondrex" target="_blank" style={{ color: "#3b82f6", textDecoration: "none" }}>
          JADSONDREX
        </a>
      </div>

    </div>
  );
}