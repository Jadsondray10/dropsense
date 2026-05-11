"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PROJECTS } from "@/lib/projects";
import Link from "next/link";

interface Analysis {
  score: number;
  verdict: string;
  reasoning: string;
  topSignals: string[];
  risks: string[];
  timeframe: string;
}

interface Narrative {
  title: string;
  description: string;
  strength: string;
  relevantProjects: string[];
  action: string;
}

interface NarrativeData {
  narratives: Narrative[];
  marketSentiment: string;
  topOpportunity: string;
}

function verdictColor(verdict: string): string {
  if (verdict === "PRIME") return "#16a34a";
  if (verdict === "STRONG") return "#7c3aed";
  if (verdict === "MODERATE") return "#f59e0b";
  return "#ef4444";
}

function strengthStyle(strength: string): { bg: string; text: string } {
  if (strength === "HOT") return { bg: "#fef2f2", text: "#ef4444" };
  if (strength === "RISING") return { bg: "#fff7ed", text: "#f97316" };
  return { bg: "#f3f4f6", text: "#6b7280" };
}

function sentimentStyle(sentiment: string): { color: string } {
  if (sentiment === "BULLISH") return { color: "#16a34a" };
  if (sentiment === "NEUTRAL") return { color: "#f59e0b" };
  return { color: "#ef4444" };
}

export default function IntelligencePage() {
  const [analyses, setAnalyses] = useState<Record<string, Analysis>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [narrativeData, setNarrativeData] = useState<NarrativeData | null>(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);

  const analyzeProject = async (projectId: string) => {
    setLoading(prev => ({ ...prev, [projectId]: true }));
    try {
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const data = await res.json();
      setAnalyses(prev => ({ ...prev, [projectId]: data }));
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setLoading(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const fetchNarratives = async () => {
    setNarrativeLoading(true);
    try {
      const res = await fetch("/api/narrative");
      const data = await res.json();
      setNarrativeData(data);
    } catch (err) {
      console.error("Narrative fetch failed:", err);
    } finally {
      setNarrativeLoading(false);
    }
  };

  useEffect(() => {
    fetchNarratives();
  }, []);

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
            <Link href="/projects" style={{ textDecoration: "none", color: "#6b7280", fontSize: "14px", fontWeight: "500" }}>Projects</Link>
            <Link href="/intelligence" style={{ textDecoration: "none", color: "#7c3aed", fontSize: "14px", fontWeight: "600" }}>Intelligence</Link>
          </div>
        </div>
        <ConnectButton />
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 32px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", margin: "0 0 8px" }}>Ecosystem Intelligence</h1>
          <p style={{ fontSize: "14px", color: "#9ca3af", margin: 0 }}>AI-powered insights on Web3 ecosystem trends and opportunities</p>
        </div>

        {/* Market Sentiment */}
        {narrativeData && (
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "24px 28px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ color: "#111827", fontSize: "15px", fontWeight: "700" }}>Market Sentiment</span>
              <span style={{ ...sentimentStyle(narrativeData.marketSentiment), fontSize: "14px", fontWeight: "700" }}>
                {narrativeData.marketSentiment}
              </span>
            </div>
            <p style={{ color: "#6b7280", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>
              <span style={{ color: "#7c3aed", fontWeight: "600" }}>Top Opportunity: </span>
              {narrativeData.topOpportunity}
            </p>
          </div>
        )}

        {/* Narrative Feed */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: 0 }}>Trending Narratives</h2>
            <button onClick={fetchNarratives} style={{ background: "white", border: "1px solid #e5e7eb", color: "#7c3aed", fontSize: "13px", fontWeight: "600", padding: "6px 16px", borderRadius: "8px", cursor: "pointer" }}>
              {narrativeLoading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {narrativeLoading && (
            <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "14px", padding: "32px", background: "white", borderRadius: "16px", border: "1px solid #e5e7eb" }}>
              AI scanning ecosystem narratives...
            </div>
          )}

          {narrativeData && !narrativeLoading && narrativeData.narratives && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {narrativeData.narratives.map((n, i) => {
                const ss = strengthStyle(n.strength);
                return (
                  <div key={i} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span style={{ color: "#111827", fontSize: "15px", fontWeight: "700" }}>{n.title}</span>
                      <span style={{ background: ss.bg, color: ss.text, fontSize: "11px", padding: "2px 10px", borderRadius: "100px", fontWeight: "700", flexShrink: 0, marginLeft: "12px" }}>
                        {n.strength}
                      </span>
                    </div>
                    <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 12px", lineHeight: 1.6 }}>{n.description}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {n.relevantProjects.map((p, j) => (
                          <span key={j} style={{ background: "#ede9fe", color: "#7c3aed", fontSize: "11px", padding: "2px 10px", borderRadius: "100px", fontWeight: "600" }}>{p}</span>
                        ))}
                      </div>
                      <span style={{ color: "#7c3aed", fontSize: "12px", fontWeight: "600" }}>→ {n.action}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Scoring */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0 0 16px" }}>AI Ecosystem Scoring</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {PROJECTS.map((project) => {
              const analysis = analyses[project.id];
              const isLoading = loading[project.id];
              return (
                <div key={project.id} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "24px 28px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: analysis ? "20px" : "0" }}>
                    <div>
                      <span style={{ color: "#111827", fontSize: "17px", fontWeight: "700" }}>{project.name}</span>
                      <span style={{ color: "#9ca3af", fontSize: "12px", marginLeft: "10px" }}>{project.chain}</span>
                    </div>
                    <button
                      onClick={() => analyzeProject(project.id)}
                      disabled={isLoading}
                      style={{ background: isLoading ? "#f3f4f6" : "linear-gradient(135deg, #7c3aed, #06b6d4)", border: "none", color: isLoading ? "#9ca3af" : "white", fontSize: "13px", fontWeight: "600", padding: "8px 20px", borderRadius: "8px", cursor: isLoading ? "not-allowed" : "pointer" }}
                    >
                      {isLoading ? "Analyzing..." : analysis ? "Re-analyze" : "Analyze →"}
                    </button>
                  </div>

                  {analysis && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f3f4f6" }}>
                        <div style={{ fontSize: "40px", fontWeight: "800", color: verdictColor(analysis.verdict) }}>{analysis.score}</div>
                        <div>
                          <div style={{ color: verdictColor(analysis.verdict), fontSize: "14px", fontWeight: "700" }}>{analysis.verdict}</div>
                          <div style={{ color: "#9ca3af", fontSize: "12px" }}>Est. {analysis.timeframe}</div>
                        </div>
                      </div>
                      <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: 1.7, marginBottom: "16px" }}>{analysis.reasoning}</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                          <div style={{ color: "#16a34a", fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>TOP SIGNALS</div>
                          {analysis.topSignals.map((s, i) => (
                            <div key={i} style={{ color: "#6b7280", fontSize: "12px", marginBottom: "4px" }}>▸ {s}</div>
                          ))}
                        </div>
                        <div>
                          <div style={{ color: "#ef4444", fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>RISKS</div>
                          {analysis.risks.map((r, i) => (
                            <div key={i} style={{ color: "#6b7280", fontSize: "12px", marginBottom: "4px" }}>▸ {r}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {!analysis && !isLoading && (
                    <div style={{ color: "#9ca3af", fontSize: "13px", marginTop: "8px" }}>
                      Click Analyze to get AI ecosystem scoring
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "24px 32px", textAlign: "center", background: "white", marginTop: "48px" }}>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
          Powered by Groq · Built on GenLayer · By{" "}
          <a href="https://twitter.com/jadsondrex" target="_blank" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: "600" }}>Jadsondrex</a>
        </p>
      </footer>
    </div>
  );
  }