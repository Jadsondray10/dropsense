"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PROJECTS } from "@/lib/projects";
import Link from "next/link";
import { use } from "react";

function typeColor(type: string): string {
  const colors: Record<string, string> = {
    bridge: "#a855f7",
    swap: "#3b82f6",
    stake: "#10b981",
    testnet: "#f0c040",
    social: "#ec4899",
    build: "#00ff9d",
  };
  return colors[type] || "#64748b";
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    return (
      <div style={{ minHeight: "100vh", background: "#060a14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", color: "#64748b" }}>
        PROJECT NOT FOUND
      </div>
    );
  }

  const completedCount = Object.values(completed).filter(Boolean).length;
  const totalTasks = project.tasks.length;
  const totalPoints = project.tasks.reduce((sum, t) => sum + t.points, 0);
  const earnedPoints = project.tasks.filter((t) => completed[t.id]).reduce((sum, t) => sum + t.points, 0);
  const progressPct = (completedCount / totalTasks) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "#060a14", padding: "32px 16px", fontFamily: "monospace" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <Link href="/projects" style={{ textDecoration: "none", color: "#475569", fontSize: "11px", letterSpacing: "2px" }}>
            ← BACK
          </Link>
          <ConnectButton />
        </div>

        <div style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1526 100%)", border: "1px solid #1e3a5f", borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ color: "#e2e8f0", fontSize: "24px", fontWeight: "700", margin: "0 0 8px" }}>{project.name}</h1>
              <p style={{ color: "#64748b", fontSize: "11px", margin: "0 0 16px", lineHeight: 1.6 }}>{project.description}</p>
              <div style={{ display: "flex", gap: "12px" }}>
                <a href={project.website} target="_blank" style={{ color: "#3b82f6", fontSize: "10px", letterSpacing: "1px" }}>WEBSITE ↗️</a>
                <a href={project.twitter} target="_blank" style={{ color: "#3b82f6", fontSize: "10px", letterSpacing: "1px" }}>TWITTER ↗️</a>
              </div>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0, marginLeft: "16px" }}>
              <div style={{ fontSize: "36px", fontWeight: "700", color: "#00ff9d" }}>{project.probability}</div>
              <div style={{ fontSize: "9px", color: "#475569", letterSpacing: "1px" }}>PROBABILITY</div>
            </div>
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1526 100%)", border: "1px solid #1e3a5f", borderRadius: "12px", padding: "20px 24px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ color: "#94a3b8", fontSize: "11px", letterSpacing: "2px" }}>YOUR PROGRESS</span>
            <span style={{ color: "#e2e8f0", fontSize: "11px" }}>{completedCount}/{totalTasks} tasks · {earnedPoints}/{totalPoints} pts</span>
          </div>
          <div style={{ height: "4px", background: "#1e293b", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: progressPct + "%", background: "#00ff9d", borderRadius: "2px", transition: "width 0.5s ease" }} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {project.tasks.map((task) => (
            <div key={task.id} onClick={() => setCompleted(prev => ({ ...prev, [task.id]: !prev[task.id] }))}
              style={{ background: completed[task.id] ? "rgba(0,255,157,0.05)" : "linear-gradient(135deg, #0a0f1e 0%, #0d1526 100%)", border: "1px solid " + (completed[task.id] ? "#00ff9d44" : "#1e3a5f"), borderRadius: "10px", padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px", transition: "all 0.2s" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid " + (completed[task.id] ? "#00ff9d" : "#334155"), background: completed[task.id] ? "#00ff9d" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "10px", color: "#060a14", fontWeight: "700" }}>
                {completed[task.id] ? "✓" : ""}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: completed[task.id] ? "#64748b" : "#e2e8f0", fontSize: "13px", fontWeight: "600", marginBottom: "4px", textDecoration: completed[task.id] ? "line-through" : "none" }}>{task.title}</div>
                <div style={{ color: "#475569", fontSize: "10px" }}>{task.description}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ background: typeColor(task.type) + "22", border: "1px solid " + typeColor(task.type) + "44", color: typeColor(task.type), fontSize: "9px", letterSpacing: "1px", padding: "2px 8px", borderRadius: "4px", marginBottom: "4px", display: "inline-block" }}>
                  {task.type.toUpperCase()}
                </div>
                <div style={{ color: "#475569", fontSize: "10px" }}>+{task.points} pts</div>
                <a
  href={task.link}
  target="_blank"
  onClick={(e) => e.stopPropagation()}
  style={{
    color: "#3b82f6",
    fontSize: "9px",
    letterSpacing: "1px",
    textDecoration: "none",
    border: "1px solid #1e3a5f",
    padding: "3px 8px",
    borderRadius: "4px",
    display: "inline-block",
    marginTop: "4px",
  }}
>
  GO →
</a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}