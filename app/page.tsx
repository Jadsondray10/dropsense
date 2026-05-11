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
      background: "#f8f9ff",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>

      {/* Top gradient bar */}
      <div style={{
        height: "4px",
        background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
      }} />

      {/* Nav */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px",
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: "700", fontSize: "14px",
            }}>DS</div>
            <span style={{ fontWeight: "700", fontSize: "18px", color: "#111827" }}>
              Drop<span style={{ color: "#7c3aed" }}>Sense</span>
            </span>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link href="/projects" style={{ textDecoration: "none", color: "#6b7280", fontSize: "14px", fontWeight: "500" }}>Projects</Link>
            <Link href="/intelligence" style={{ textDecoration: "none", color: "#6b7280", fontSize: "14px", fontWeight: "500" }}>Intelligence</Link>
          </div>
        </div>
        <ConnectButton />
      </nav>

      {/* Hero */}
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "80px 32px 48px",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "linear-gradient(135deg, #ede9fe, #cffafe)",
          border: "1px solid #c4b5fd",
          borderRadius: "100px",
          padding: "6px 16px",
          marginBottom: "24px",
        }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#7c3aed" }} />
          <span style={{ fontSize: "13px", color: "#7c3aed", fontWeight: "600" }}>
            Built on GenLayer
          </span>
        </div>

        <h1 style={{
          fontSize: "52px",
          fontWeight: "800",
          color: "#111827",
          margin: "0 0 16px",
          lineHeight: 1.2,
        }}>
          Track. Build.{" "}
          <span style={{
            background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Earn.
          </span>
        </h1>

        <p style={{
          fontSize: "18px",
          color: "#6b7280",
          maxWidth: "560px",
          margin: "0 auto 40px",
          lineHeight: 1.7,
        }}>
          Your Web3 ecosystem dashboard. Track on-chain activity, discover early opportunities, and monitor your builder progress across GenLayer and beyond.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <ConnectButton />
          <Link href="/projects" style={{
            textDecoration: "none",
            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            padding: "10px 24px",
            borderRadius: "8px",
          }}>
            Explore Projects →
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        background: "white",
        borderTop: "1px solid #e5e7eb",
        borderBottom: "1px solid #e5e7eb",
        padding: "24px 32px",
      }}>
        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "32px",
          textAlign: "center",
        }}>
          {[
            { label: "Projects Tracked", value: "3" },
            { label: "Chains Supported", value: "4" },
            { label: "Tasks Available", value: "15" },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: "28px", fontWeight: "800", color: "#7c3aed" }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity card */}
      <div style={{ maxWidth: "900px", margin: "48px auto", padding: "0 32px" }}>
        {isConnected && address ? (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>
              Your Base Activity
            </h2>
            <BaseActivityCard address={address} />
          </div>
        ) : (
          <div style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "48px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}>
            <div style={{
              width: "56px", height: "56px",
              background: "linear-gradient(135deg, #ede9fe, #cffafe)",
              borderRadius: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "24px",
            }}>⬡</div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0 0 8px" }}>
              Connect Your Wallet
            </h3>
            <p style={{ fontSize: "14px", color: "#9ca3af", margin: "0 0 24px" }}>
              Connect to scan your Base chain activity and track your ecosystem progress
            </p>
            <ConnectButton />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #e5e7eb",
        padding: "24px 32px",
        textAlign: "center",
        background: "white",
      }}>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
          Built on GenLayer · By{" "}
          <a href="https://twitter.com/jadsondrex" target="_blank" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: "600" }}>
            Jadsondrex
          </a>
        </p>
      </footer>

    </div>
  );
}