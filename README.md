# Semantic Therapist Matcher

A minimal Next.js demo application that uses OpenAI embeddings and cosine similarity to match users with therapists based on their free-text input.

## Features

- Single-page UI where users describe how they feel
- Semantic matching using OpenAI's `text-embedding-3-small` model
- Returns top 3 best-matched therapists with similarity scores
- No database required - uses pre-generated embeddings stored in JSON

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

3. Generate embeddings for therapists:
```bash
npm run build:embeddings
```

This script will:
- Read therapist data from `data/therapists.ts`
- Generate embeddings using OpenAI for each therapist's bio
- Save the results to `data/therapists.embedded.json`

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Type how you're feeling in the textarea (e.g., "I'm experiencing burnout from work")
2. Click "Find matches" or use one of the example prompts
3. View the top 3 matched therapists with their specialties, availability, and similarity scores

## API Endpoints

### POST `/api/embed`

Generate an embedding vector for a given text.

**Request:**
```json
{
  "text": "I'm feeling anxious about my job"
}
```

**Response:**
```json
{
  "vector": [0.0123, -0.0456, ...]
}
```

### POST `/api/match`

Find top 3 matching therapists for a given text.

**Request:**
```json
{
  "text": "I'm experiencing burnout from work"
}
```

**Response:**
```json
{
  "matches": [
    {
      "id": "t1",
      "name": "Dr. Sarah Chen",
      "bio": "...",
      "specialties": ["burnout", "work stress", "career counseling"],
      "nextAvailableAt": "2024-01-15T10:00:00Z",
      "score": 0.8234
    },
    ...
  ]
}
```

**Example with curl:**
```bash
curl -X POST http://localhost:3000/api/match \
  -H "Content-Type: application/json" \
  -d '{"text": "I have been having panic attacks"}'
```

## Project Structure

```
therapist-matcher/
├── app/
│   ├── api/
│   │   ├── embed/
│   │   │   └── route.ts          # Embedding generation endpoint
│   │   └── match/
│   │       └── route.ts          # Therapist matching endpoint
│   └── page.tsx                   # Main UI component
├── data/
│   ├── therapists.ts              # Seed therapist data
│   └── therapists.embedded.json   # Generated embeddings (run build:embeddings)
├── scripts/
│   └── build-embeddings.ts       # Script to generate embeddings
└── package.json
```

## How It Works

1. **Embedding Generation**: Each therapist's bio is converted to a vector using OpenAI's embedding model
2. **Query Processing**: User input is also converted to an embedding vector
3. **Similarity Matching**: Cosine similarity is computed between the query vector and each therapist's embedding
4. **Ranking**: Therapists are sorted by similarity score (highest first) and top 3 are returned

## Technologies

- Next.js 16 (App Router)
- TypeScript
- OpenAI API (text-embedding-3-small)
- React 19

## Notes

- The embeddings file (`therapists.embedded.json`) should be committed to the repository for the demo
- The script includes a 150ms delay between API calls to avoid rate limits
- All similarity scores are rounded to 4 decimal places
