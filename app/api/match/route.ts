import OpenAI from "openai";
import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Computes cosine similarity between two vectors.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) {
    return 0;
  }

  return dotProduct / denominator;
}

/**
 * POST endpoint to match user text with top 3 therapists using semantic similarity.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = body?.text;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing or invalid text" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Generate embedding for user query
    const queryResponse = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    const queryEmbedding = queryResponse.data[0].embedding;

    // Load therapists with embeddings
    const embeddingsPath = join(process.cwd(), "data", "therapists.embedded.json");
    let therapistsWithEmbeddings: Array<{
      id: string;
      name: string;
      bio: string;
      specialties: string[];
      nextAvailableAt: string;
      embedding: number[];
    }>;

    try {
      const fileContent = readFileSync(embeddingsPath, "utf-8");
      therapistsWithEmbeddings = JSON.parse(fileContent);
    } catch {
      return NextResponse.json(
        { error: "Embeddings file not found. Please run: npm run build:embeddings" },
        { status: 500 }
      );
    }

    // Compute similarity scores
    const scoredTherapists = therapistsWithEmbeddings.map((therapist) => {
      const score = cosineSimilarity(queryEmbedding, therapist.embedding);
      return {
        id: therapist.id,
        name: therapist.name,
        bio: therapist.bio,
        specialties: therapist.specialties,
        nextAvailableAt: therapist.nextAvailableAt,
        score: Math.round(score * 10000) / 10000, // Round to 4 decimals
      };
    });

    // Sort by score (descending) and take top 3
    // Use id as secondary sort for stability
    scoredTherapists.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.id.localeCompare(b.id);
    });

    const top3 = scoredTherapists.slice(0, 3);

    return NextResponse.json({ matches: top3 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Match error:", err);
    return NextResponse.json(
      { error: "Matching failed", detail: message },
      { status: 500 }
    );
  }
}

