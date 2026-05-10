import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const PROJECT_CONTEXT = {
  genlayer: {
    name: "GenLayer",
    description: "AI-powered smart contracts with optimistic consensus. Builders program active.",
    chain: "EVM",
    status: "testnet",
    funding: "Backed by major VCs, active developer ecosystem",
    signals: "Active builders program, testnet live, strong community growth",
  },
  miden: {
    name: "Miden",
    description: "Polygon's ZK rollup with client-side proving.",
    chain: "Polygon ZK",
    status: "testnet",
    funding: "Backed by Polygon, strong ZK ecosystem",
    signals: "Testnet live, growing developer interest in ZK space",
  },
  arc: {
    name: "Arc",
    description: "Circle-backed L1 blockchain on testnet.",
    chain: "L1",
    status: "testnet",
    funding: "Backed by Circle, USDC integration planned",
    signals: "Circle backing is massive signal, testnet active, waitlist growing",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { projectId } = await req.json();

    const project = PROJECT_CONTEXT[projectId as keyof typeof PROJECT_CONTEXT];

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 400 });
    }

    const prompt = `You are a crypto airdrop analyst with deep expertise in blockchain ecosystems.

Analyze this project for airdrop probability:

Project: ${project.name}
Chain: ${project.chain}
Status: ${project.status}
Description: ${project.description}
Funding: ${project.funding}
Signals: ${project.signals}

Provide a JSON response with exactly this structure:
{
  "score": <number 0-100>,
  "verdict": "<one of: PRIME | STRONG | MODERATE | WEAK>",
  "reasoning": "<2-3 sentence analysis>",
  "topSignals": ["<signal 1>", "<signal 2>", "<signal 3>"],
  "risks": ["<risk 1>", "<risk 2>"],
  "timeframe": "<estimated airdrop timeframe e.g. Q3 2025>"
}

Return only valid JSON, no other text.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content || "";
    const analysis = JSON.parse(content);

    return NextResponse.json(analysis);
  } catch (err) {
    console.error("Intelligence API error:", err);
    return NextResponse.json({ error: "Failed to analyze project" }, { status: 500 });
  }
}