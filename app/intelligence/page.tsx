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
  if (verdict === "PRIME") return "#00ff9d";
  if (verdict === "STRONG") return "#3b82f6";
  if (verdict === "MODERATE") return "#f0c040";
  return "#ff4d4d";
}

function strengthColor(strength: string): string {
  if (strength === "HOT") return "#ff4d4d";
  if (strength === "RISING") return "#f0c040";
  return "#64748b";
}

function sentimentColor(sentiment: string): string {
  if (sentiment === "BULLISH") return "#00ff9d";
  if (sentiment === "NEUTRAL") return "#f0c040";
  return "#ff4d4d";
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
    <div style={{ minHeight: "100vh", background: "#060a14", padding: "32px 16px", fontFamily: "monospace" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <Link href="/" style={{ textDecoration: "none" }}>
              <h1 style={{ color: "#3b82f6", fontSize: "20px", letterSpacing: "4px", margin: 0, fontWeight: 700 }}>
                DROP<span style={{ color: "#00ff9d" }}>SENSE</span>
              </h1>
            </Link>
            <p style={{ color: "#334155", fontSize: "10px", letterSpacing: "3px", margin: "4px 0 0" }}>
              AI INTELLIGENCE
            </p>
          </div>
          <ConnectButton />
        </div>

        {/* Market Sentiment */}
        {narrativeData && (
          <div style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1526 100%)", border: "1px solid #1e3a5f", borderRadius: "12px", padding: "20px 24px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ color: "#94a3b8", fontSize: "11px", letterSpacing: "2px" }}>MARKET SENTIMENT</span>
              <span style={{ color: sentimentColor(narrativeData.marketSentiment), fontSize: "13px", fontWeight: "700", letterSpacing: "2px" }}>
                {narrativeData.marketSentiment}
              </span>
            </div>
            <p style={{ color: "#64748b", fontSize: "11px", margin: 0, lineHeight: 1.6 }}>
              <span style={{ color: "#00ff9d" }}>TOP OPPORTUNITY: </span>
              {narrativeData.topOpportunity}
            </p>
          </div>
        )}

        {/* Narrative Feed */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ color: "#94a3b8", fontSize: "11px", letterSpacing: "2px" }}>TRENDING NARRATIVES</span>
            <button
              onClick={fetchNarratives}
              style={{ background: "none", border: "1px solid #1e3a5f", color: "#3b82f6", fontSize: "9px", letterSpacing: "2px", padding: "4px 12px", borderRadius: "4px", cursor: "pointer" }}
            >
              {narrativeLoading ? "LOADING..." : "REFRESH"}
            </button>
          </div>

          {narrativeLoading && (
            <div style={{ textAlign: "center", color: "#334155", fontSize: "11px", letterSpacing: "2px", padding: "32px" }}>
              AI SCANNING NARRATIVES...
            </div>
          )}

          {narrativeData && !narrativeLoading && narrativeData.narratives && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {narrativeData.narratives.map((n, i) => (
                <div key={i} style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1526 100%)", border: "1px solid #1e3a5f", borderRadius: "10px", padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: "600" }}>{n.title}</span>
                    <span style={{ color: strengthColor(n.strength), fontSize: "9px", letterSpacing: "2px", fontWeight: "700", border: "1px solid " + strengthColor(n.strength) + "44", padding: "2px 8px", borderRadius: "4px" }}>
                      {n.strength}
                    </span>
                  </div>
                  <p style={{ color: "#64748b", fontSize: "11px", margin: "0 0 10px", lineHeight: 1.6 }}>{n.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {n.relevantProjects.map((p, j) => (
                        <span key={j} style={{ background: "#1e293b", color: "#3b82f6", fontSize: "9px", padding: "2px 8px", borderRadius: "4px", letterSpacing: "1px" }}>
                          {p}
                        </span>
                      ))}
                    </div>
                    <span style={{ color: "#00ff9d", fontSize: "10px" }}>→ {n.action}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Project Scoring */}
        <div>
          <div style={{ color: "#94a3b8", fontSize: "11px", letterSpacing: "2px", marginBottom: "16px" }}>
            AI PROBABILITY SCORING
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {PROJECTS.map((project) => {
              const analysis = analyses[project.id];
              const isLoading = loading[project.id];

              return (
                <div key={project.id} style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1526 100%)", border: "1px solid #1e3a5f", borderRadius: "12px", padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div>
                      <span style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: "700" }}>{project.name}</span>
                      <span style={{ color: "#475569", fontSize: "10px", marginLeft: "10px" }}>{project.chain}</span>
                    </div>
                    <button
                      onClick={() => analyzeProject(project.id)}
                      disabled={isLoading}
                      style={{ background: isLoading ? "#1e293b" : "rgba(59,130,246,0.1)", border: "1px solid " + (isLoading ? "#334155" : "#3b82f6"), color: isLoading ? "#475569" : "#3b82f6", fontSize: "10px", letterSpacing: "2px", padding: "6px 16px", borderRadius: "6px", cursor: isLoading ? "not-allowed" : "pointer" }}
                    >
                      {isLoading ? "ANALYZING..." : analysis ? "RE-ANALYZE" : "ANALYZE →"}
                    </button>
                  </div>

                  {analysis && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                        <div style={{ fontSize: "36px", fontWeight: "700", color: verdictColor(analysis.verdict) }}>{analysis.score}</div>
                        <div>
                          <div style={{ color: verdictColor(analysis.verdict), fontSize: "13px", fontWeight: "700", letterSpacing: "2px" }}>{analysis.verdict}</div>
                          <div style={{ color: "#475569", fontSize: "10px" }}>EST. {analysis.timeframe}</div>
                        </div>
                      </div>

                      <p style={{ color: "#94a3b8", fontSize: "11px", lineHeight: 1.7, marginBottom: "16px" }}>{analysis.reasoning}</p>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <div style={{ color: "#00ff9d", fontSize: "9px", letterSpacing: "2px", marginBottom: "8px" }}>TOP SIGNALS</div>
                          {analysis.topSignals.map((s, i) => (
                            <div key={i} style={{ color: "#64748b", fontSize: "10px", marginBottom: "4px" }}>
                              ▸ {s}
                            </div>
                          ))}
                        </div>
                        <div>
                          <div style={{ color: "#ff4d4d", fontSize: "9px", letterSpacing: "2px", marginBottom: "8px" }}>RISKS</div>
                          {analysis.risks.map((r, i) => (
                            <div key={i} style={{ color: "#64748b", fontSize: "10px", marginBottom: "4px" }}>
                              ▸ {r}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {!analysis && !isLoading && (
                    <div style={{ color: "#334155", fontSize: "10px", letterSpacing: "2px" }}>
                      CLICK ANALYZE TO GET AI PROBABILITY SCORE
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "40px", fontSize: "9px", letterSpacing: "2px", color: "#1e3a5f" }}>
          POWERED BY GROQ · BUILT ON GENLAYER · BY{" "}
          <a href="https://twitter.com/jadsondrex" target="_blank" style={{ color: "#3b82f6", textDecoration: "none" }}>
            JADSONDREX
          </a>
        </div>

      </div>
    </div>
  );
}