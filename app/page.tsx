"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { BaseActivityCard } from "@/components/BaseActivityCard";

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

      <ConnectButton />

      {isConnected && address && (
        <BaseActivityCard address={address} />
      )}

      {!isConnected && (
        <div style={{
          border: "1px solid #1e3a5f",
          borderRadius: "12px",
          padding: "32px",
          textAlign: "center",
          color: "#475569",
          fontSize: "12px",
          letterSpacing: "2px",
          maxWidth: "480px",
          width: "100%",
        }}>
          CONNECT YOUR WALLET TO SCAN YOUR BASE ACTIVITY
        </div>
      )}
    </div>
  );
}