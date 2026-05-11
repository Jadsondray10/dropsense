"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PROJECTS } from "@/lib/projects";
import Link from "next/link";
import { use } from "react";

function typeColor(type: string): { bg: string; text: string } {
  const colors: Record<string, { bg: string; text: string }> = {
    bridge: { bg: "#faf5ff", text: "#7c3aed" },
    swap: { bg: "#eff6ff", text: "#3b82f6" },
    stake: { bg: "#f0fdf4", text: "#16a34a" },
    testnet: { bg: "#ecfeff", text: "#06b6d4" },
    social: { bg: "#fdf2f8", text: "#ec4899" },
    build: { bg: "#fff7ed", text: "#f97316" },
  };
  return colors[type] || { bg: "#f3f4f6", text: "#6b7280" };
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f9ff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", color: "#9ca3af" }}>
        Project not found
      </div>
    );
  }

  const completedCount = Object.values(completed).filter(Boolean).length;
  const totalTasks = project.tasks.length;
  const totalPoints = project.tasks.reduce((sum, t) => sum + t.points, 0);
  const earnedPoints = project.tasks.filter((t) => completed[t.id]).reduce((sum, t) => sum + t.points, 0);
  const progressPct = (completedCount / totalTasks) * 100;

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

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 32px" }}>

        {/* Back */}
        <Link href="/projects" style={{ textDecoration: "none", color: "#7c3aed", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "24px" }}>
          ← Back to Projects
        </Link>

        {/* Project header */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "28px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", margin: "0 0 8px" }}>{project.name}</h1>
              <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 16px", lineHeight: 1.7 }}>{project.description}</p>
              <div style={{ display: "flex", gap: "12px" }}>
                <a href={project.website} target="_blank" style={{ color: "#7c3aed", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>Website ↗️</a>
                <a href={project.twitter} target="_blank" style={{ color: "#7c3aed", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>Twitter ↗️</a>
              </div>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0, marginLeft: "24px" }}>
              <div style={{ fontSize: "40px", fontWeight: "800", background: "linear-gradient(135deg, #7c3aed, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {project.probability}
              </div>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>PROBABILITY</div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "20px 28px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ color: "#111827", fontSize: "14px", fontWeight: "600" }}>Your Progress</span>
            <span style={{ color: "#6b7280", fontSize: "13px" }}>{completedCount}/{totalTasks} tasks · {earnedPoints}/{totalPoints} pts</span>
          </div>
          <div style={{ height: "8px", background: "#f3f4f6", borderRadius: "100px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: progressPct + "%", background: "linear-gradient(90deg, #7c3aed, #06b6d4)", borderRadius: "100px", transition: "width 0.5s ease" }} />
          </div>
        </div>

        {/* Tasks */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {project.tasks.map((task) => {
            const tc = typeColor(task.type);
            return (
              <div key={task.id}
                onClick={() => setCompleted(prev => ({ ...prev, [task.id]: !prev[task.id] }))}
                style={{ background: completed[task.id] ? "#f0fdf4" : "white", border: "1px solid " + (completed[task.id] ? "#86efac" : "#e5e7eb"), borderRadius: "12px", padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "all 0.2s" }}>

                {/* Checkbox */}
                <div style={{ width: "22px", height: "22px", borderRadius: "50%", border: "2px solid " + (completed[task.id] ? "#16a34a" : "#d1d5db"), background: completed[task.id] ? "#16a34a" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "11px", color: "white", fontWeight: "700", transition: "all 0.2s" }}>
                  {completed[task.id] ? "✓" : ""}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ color: completed[task.id] ? "#9ca3af" : "#111827", fontSize: "14px", fontWeight: "600", marginBottom: "3px", textDecoration: completed[task.id] ? "line-through" : "none" }}>{task.title}</div>
                  <div style={{ color: "#9ca3af", fontSize: "12px" }}>{task.description}</div>
                </div>

                {/* Right */}
                <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                  <span style={{ background: tc.bg, color: tc.text, fontSize: "11px", padding: "2px 10px", borderRadius: "100px", fontWeight: "600" }}>
                    {task.type}
                  </span>
                  <span style={{ color: "#9ca3af", fontSize: "12px" }}>+{task.points} pts</span>
                  <a href={task.link} target="_blank" onClick={(e) => e.stopPropagation()}
                    style={{ color: "#7c3aed", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>
                    Go →
                  </a>
                </div>
              </div>
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