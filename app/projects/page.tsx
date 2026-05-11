"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PROJECTS } from "@/lib/projects";
import Link from "next/link";

function probabilityColor(score: number): string {
  if (score >= 80) return "#7c3aed";
  if (score >= 60) return "#06b6d4";
  return "#f59e0b";
}

function statusBadge(status: string) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    testnet: { bg: "#ede9fe", text: "#7c3aed", border: "#c4b5fd" },
    "tge-soon": { bg: "#fae8ff", text: "#a855f7", border: "#e879f9" },
    mainnet: { bg: "#dcfce7", text: "#16a34a", border: "#86efac" },
  };
  return colors[status] || { bg: "#f3f4f6", text: "#6b7280", border: "#d1d5db" };
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  bridge: { bg: "#faf5ff", text: "#7c3aed" },
  swap: { bg: "#eff6ff", text: "#3b82f6" },
  stake: { bg: "#f0fdf4", text: "#16a34a" },
  testnet: { bg: "#ecfeff", text: "#06b6d4" },
  social: { bg: "#fdf2f8", text: "#ec4899" },
  build: { bg: "#fff7ed", text: "#f97316" },
};

export default function ProjectsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8f9ff", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* Top gradient bar */}
      <div style={{ height: "4px", background: "linear-gradient(90deg, #7c3aed, #06b6d4)" }} />

      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", background: "#ffffff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #7c3aed, #06b6d4)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>DS</div>
            <span style={{ fontWeight: "700", fontSize: "18px", color: "#111827" }}>Drop<span style={{ color: "#7c3aed" }}>Sense</span></span>
          </Link>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link href="/projects" style={{ textDecoration: "none", color: "#7c3aed", fontSize: "14px", fontWeight: "600" }}>Projects</Link>
            <Link href="/intelligence" style={{ textDecoration: "none", color: "#6b7280", fontSize: "14px", fontWeight: "500" }}>Intelligence</Link>
          </div>
        </div>
        <ConnectButton />
      </nav>

      {/* Content */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 32px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", margin: "0 0 8px" }}>Ecosystem Projects</h1>
          <p style={{ fontSize: "14px", color: "#9ca3af", margin: 0 }}>Track early opportunities across Web3 ecosystems</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {PROJECTS.map((project) => {
            const badge = statusBadge(project.status);
            return (
              <Link key={project.id} href={"/projects/" + project.id} style={{ textDecoration: "none" }}>
                <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "24px", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "box-shadow 0.2s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <span style={{ color: "#111827", fontSize: "18px", fontWeight: "700" }}>{project.name}</span>
                        <span style={{ background: badge.bg, border: "1px solid " + badge.border, color: badge.text, fontSize: "11px", padding: "2px 10px", borderRadius: "100px", fontWeight: "600" }}>
                          {project.status.toUpperCase()}
                        </span>
                        <span style={{ color: "#9ca3af", fontSize: "12px" }}>{project.chain}</span>
                      </div>
                      <p style={{ color: "#6b7280", fontSize: "13px", margin: 0, lineHeight: 1.6, maxWidth: "500px" }}>{project.description}</p>
                    </div>
                    <div style={{ textAlign: "center", flexShrink: 0, marginLeft: "24px" }}>
                      <div style={{ fontSize: "32px", fontWeight: "800", color: probabilityColor(project.probability) }}>{project.probability}</div>
                      <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>PROBABILITY</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {project.tasks.slice(0, 3).map((task) => {
                        const tc = TYPE_COLORS[task.type] || { bg: "#f3f4f6", text: "#6b7280" };
                        return (
                          <span key={task.id} style={{ background: tc.bg, color: tc.text, fontSize: "11px", padding: "3px 10px", borderRadius: "100px", fontWeight: "600" }}>
                            {task.type}
                          </span>
                        );
                      })}
                      {project.tasks.length > 3 && (
                        <span style={{ color: "#9ca3af", fontSize: "12px", padding: "3px 0" }}>+{project.tasks.length - 3} more</span>
                      )}
                    </div>
                    <span style={{ color: "#7c3aed", fontSize: "13px", fontWeight: "600" }}>View Tasks →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "24px 32px", textAlign: "center", background: "white", marginTop: "48px" }}>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
          Built on GenLayer · By{" "}
          <a href="https://twitter.com/jadsondrex" target="_blank" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: "600" }}>Jadsondrex</a>
        </p>
      </footer>
    </div>
  );
}