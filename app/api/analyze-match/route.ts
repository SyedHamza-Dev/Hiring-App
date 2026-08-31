import { NextRequest, NextResponse } from "next/server";
import { pipeline, type FeatureExtractionPipeline } from "@xenova/transformers";

export const runtime = "nodejs";

interface CandidateInput {
  id: string;
  filename: string;
  text: string;
}

interface CandidateResult {
  id: string;
  filename: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  email: string | null;
  phone: string | null;
  topSnippet: string;
  error?: string;
}

let embedderPromise: Promise<FeatureExtractionPipeline> | null = null;

function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    ) as Promise<FeatureExtractionPipeline>;
  }
  return embedderPromise;
}

function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

function findBestSnippet(text: string, jobSkills: string[]): string {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30)
    .slice(0, 60);

  let best = "";
  let bestOverlap = -1;

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    const overlap = jobSkills.filter((skill) =>
      lower.includes(skill.toLowerCase())
    ).length;
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      best = sentence;
    }
  }

  return best.slice(0, 240);
}

export async function POST(req: NextRequest) {
  try {
    const { jobText, jobSkills, candidates } = (await req.json()) as {
      jobText: string;
      jobSkills: string[];
      candidates: CandidateInput[];
    };

    if (!jobText?.trim() || !candidates?.length) {
      return NextResponse.json(
        { error: "jobText and at least one candidate are required" },
        { status: 400 }
      );
    }

    const model = await getEmbedder();

    const jobOutput = await model(jobText, {
      pooling: "mean",
      normalize: true,
    });
    const jobEmbedding = jobOutput.data as Float32Array;

    const results: CandidateResult[] = [];

    for (const candidate of candidates) {
      const text = candidate.text?.trim() || "";

      if (!text) {
        results.push({
          id: candidate.id,
          filename: candidate.filename,
          score: 0,
          matchedSkills: [],
          missingSkills: jobSkills,
          email: null,
          phone: null,
          topSnippet: "",
          error:
            "No extractable text found in this PDF (it may be a scanned image without a text layer).",
        });
        continue;
      }

      const candidateOutput = await model(text.slice(0, 6000), {
        pooling: "mean",
        normalize: true,
      });
      const candidateEmbedding = candidateOutput.data as Float32Array;

      const similarity = cosineSimilarity(jobEmbedding, candidateEmbedding);
      const score = Math.round(Math.max(0, Math.min(1, similarity)) * 100);

      const lowerText = text.toLowerCase();
      const matchedSkills = jobSkills.filter((skill) =>
        lowerText.includes(skill.toLowerCase())
      );
      const missingSkills = jobSkills.filter(
        (skill) => !matchedSkills.includes(skill)
      );

      const emailMatch = text.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
      );
      const phoneMatch = text.match(/(\+?\d[\d\s-]{8,}\d)/);

      results.push({
        id: candidate.id,
        filename: candidate.filename,
        score,
        matchedSkills,
        missingSkills,
        email: emailMatch ? emailMatch[0] : null,
        phone: phoneMatch ? phoneMatch[0].trim() : null,
        topSnippet: findBestSnippet(text, jobSkills),
      });
    }

    results.sort((a, b) => b.score - a.score);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("analyze-match error:", error);
    return NextResponse.json(
      { error: "Failed to analyze candidates" },
      { status: 500 }
    );
  }
}
