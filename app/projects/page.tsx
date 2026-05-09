"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PROJECTS } from "@/lib/projects";
import Link from "next/link";

function probabilityColor(score: number): string {
  if (score >= 80) return "#00ff9d";
  if (score >= 60) return "#f0c040";
  return "#ff9a3c";
}

function statusBadge(status: string) {
  const colors: Record<string, string> = {
    testnet: "#3b82f6",
    "tge-soon": "#a855f7",
    mainnet: "#10b981",
  };
  return colors[status] || "#64748b";
}

export default function ProjectsPage() {
  const { isConnected } = useAccount();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060a14",
      padding: "32px 16px",
      fontFamily: "monospace",
    }}>
      {/* Header */}
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <Link href="/" style={{ textDecoration: "none" }}>
              <h1 style={{ color: "#3b82f6", fontSize: "20px", letterSpacing: "4px", margin: 0, fontWeight: 700 }}>
                DROP<span style={{ color: "#00ff9d" }}>SENSE</span>
              </h1>
            </Link>
            <p style={{ color: "#334155", fontSize: "10px", letterSpacing: "3px", margin: "4px 0 0" }}>
              AIRDROP PROJECTS
            </p>
          </div>
          <ConnectButton />
        </div>

        {/* Projects Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {PROJECTS.map((project) => (
            <Link key={project.id} href={"/projects/" + project.id} style={{ textDecoration: "none" }}>
              <div style={{
                background: "linear-gradient(135deg, #0a0f1e 0%, #0d1526 100%)",
                border: "1px solid #1e3a5f",
                borderRadius: "12px",
                padding: "20px 24px",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <span style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: "700" }}>{project.name}</span>
                      <span style={{
                        background: statusBadge(project.status) + "22",
                        border: "1px solid " + statusBadge(project.status) + "44",
                        color: statusBadge(project.status),
                        fontSize: "9px",
                        letterSpacing: "2px",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontWeight: "700",
                      }}>
                        {project.status.toUpperCase()}
                      </span>
                      <span style={{ color: "#475569", fontSize: "10px" }}>{project.chain}</span>
                    </div>
                    <p style={{ color: "#64748b", fontSize: "11px", margin: 0, lineHeight: 1.6, maxWidth: "500px" }}>
                      {project.description}
                    </p>
                  </div>

                  <div style={{ textAlign: "center", flexShrink: 0, marginLeft: "16px" }}>
                    <div style={{ fontSize: "28px", fontWeight: "700", color: probabilityColor(project.probability) }}>
                      {project.probability}
                    </div>
                    <div style={{ fontSize: "9px", color: "#475569", letterSpacing: "1px" }}>PROBABILITY</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {project.tasks.slice(0, 3).map((task) => (
                      <span key={task.id} style={{
                        background: "#1e293b",
                        color: "#64748b",
                        fontSize: "9px",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        letterSpacing: "1px",
                      }}>
                        {task.type.toUpperCase()}
                      </span>
                    ))}
                    {project.tasks.length > 3 && (
                      <span style={{ color: "#475569", fontSize: "9px", padding: "3px 0" }}>
                        +{project.tasks.length - 3} more
                      </span>
                    )}
                  </div>
                  <span style={{ color: "#3b82f6", fontSize: "10px", letterSpacing: "1px" }}>
                    VIEW TASKS →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}