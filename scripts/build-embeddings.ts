/**
 * Script to generate embeddings for all therapists using OpenAI.
 * Reads therapists from data/therapists.ts and writes embeddings to data/therapists.embedded.json.
 */
import OpenAI from "openai";
import { therapists } from "../data/therapists";
import { writeFileSync } from "fs";
import { join } from "path";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Delays execution by the specified milliseconds.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Main function to build embeddings for all therapists.
 */
async function buildEmbeddings() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("ERROR: OPENAI_API_KEY environment variable is not set.");
    console.error("Please create a .env.local file with: OPENAI_API_KEY=your_key_here");
    process.exit(1);
  }

  console.log(`Generating embeddings for ${therapists.length} therapists...`);
  console.log("Using model: text-embedding-3-small\n");

  const therapistsWithEmbeddings = [];

  for (let i = 0; i < therapists.length; i++) {
    const therapist = therapists[i];
    console.log(`[${i + 1}/${therapists.length}] Processing: ${therapist.name}`);

    try {
      const response = await client.embeddings.create({
        model: "text-embedding-3-small",
        input: therapist.bio,
      });

      const embedding = response.data[0].embedding;
      therapistsWithEmbeddings.push({
        ...therapist,
        embedding,
      });

      console.log(`  ✓ Generated embedding (${embedding.length} dimensions)`);

      // Add delay to avoid rate limits (150ms between calls)
      if (i < therapists.length - 1) {
        await delay(150);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  ✗ Error for ${therapist.name}:`, message);
      process.exit(1);
    }
  }

  const outputPath = join(process.cwd(), "data", "therapists.embedded.json");
  writeFileSync(outputPath, JSON.stringify(therapistsWithEmbeddings, null, 2), "utf-8");

  console.log(`\n✓ Successfully generated embeddings for all therapists.`);
  console.log(`✓ Saved to: ${outputPath}`);
}

buildEmbeddings().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

