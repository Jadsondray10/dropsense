import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function GET(req: NextRequest) {
  try {
    const prompt = `You are a crypto market analyst specializing in narrative detection and airdrop hunting.

Analyze the current crypto market and identify the top trending narratives relevant to these ecosystems: GenLayer (AI smart contracts), Miden (ZK rollups), Arc (Circle-backed L1).

Provide a JSON response with exactly this structure:
{
  "narratives": [
    {
      "title": "<narrative title>",
      "description": "<2 sentence description>",
      "strength": "<HOT | RISING | COOLING>",
      "relevantProjects": ["<project name>"],
      "action": "<what airdrop hunters should do>"
    }
  ],
  "marketSentiment": "<BULLISH | NEUTRAL | BEARISH>",
  "topOpportunity": "<one sentence on the single best opportunity right now>"
}

Include 4 narratives. Return only valid JSON, no other text.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content || "";
    const data = JSON.parse(content);

    return NextResponse.json(data);
  } catch (err) {
    console.error("Narrative API error:", err);
    return NextResponse.json({ error: "Failed to fetch narratives" }, { status: 500 });
  }
}