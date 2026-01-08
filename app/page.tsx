"use client";

import { useState } from "react";

/**
 * Main page component for the Semantic Therapist Matcher.
 * Allows users to input how they feel and find the top 3 matching therapists.
 */
export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<
    Array<{
      id: string;
      name: string;
      bio: string;
      specialties: string[];
      nextAvailableAt: string;
      score: number;
    }>
  >([]);

  /**
   * Handles the form submission to find matching therapists.
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) {
      setError("Please enter how you're feeling");
      return;
    }

    setLoading(true);
    setError(null);
    setMatches([]);

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to find matches");
      }

      const data = await response.json();
      setMatches(data.matches || []);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Sets the input text to a predefined example prompt.
   */
  function setExamplePrompt(text: string) {
    setInput(text);
    setError(null);
    setMatches([]);
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "0.5rem",
          color: "#1a1a1a",
        }}
      >
        Semantic Therapist Matcher
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Describe how you're feeling, and we'll match you with therapists who specialize in your needs.
      </p>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., I've been feeling overwhelmed at work and struggling with sleep..."
          style={{
            width: "100%",
            minHeight: "120px",
            padding: "1rem",
            fontSize: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontFamily: "inherit",
            resize: "vertical",
            marginBottom: "1rem",
          }}
          disabled={loading}
        />
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              fontWeight: "500",
            }}
          >
            {loading ? "Finding matches..." : "Find matches"}
          </button>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ color: "#666", fontSize: "0.9rem" }}>Try:</span>
            <button
              type="button"
              onClick={() => setExamplePrompt("I'm experiencing burnout from work")}
              disabled={loading}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                backgroundColor: "#f5f5f5",
                border: "1px solid #ddd",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              burnout from work
            </button>
            <button
              type="button"
              onClick={() => setExamplePrompt("I've been having panic attacks")}
              disabled={loading}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                backgroundColor: "#f5f5f5",
                border: "1px solid #ddd",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              panic attacks
            </button>
            <button
              type="button"
              onClick={() => setExamplePrompt("relationship conflict with my partner")}
              disabled={loading}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                backgroundColor: "#f5f5f5",
                border: "1px solid #ddd",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              relationship conflict
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            borderRadius: "8px",
            color: "#c33",
            marginBottom: "2rem",
          }}
        >
          {error}
        </div>
      )}

      {matches.length > 0 && (
        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#1a1a1a" }}>
            Top 3 Matches
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {matches.map((therapist) => (
              <div
                key={therapist.id}
                style={{
                  padding: "1.5rem",
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                  backgroundColor: "#fafafa",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.75rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0, color: "#1a1a1a" }}>
                    {therapist.name}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "#666",
                      backgroundColor: "#e8e8e8",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "12px",
                    }}
                  >
                    Score: {therapist.score.toFixed(4)}
                  </span>
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "#333", fontSize: "0.9rem" }}>Specialties: </strong>
                  <span style={{ color: "#666", fontSize: "0.9rem" }}>
                    {therapist.specialties.join(", ")}
                  </span>
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "#333", fontSize: "0.9rem" }}>Next Available: </strong>
                  <span style={{ color: "#666", fontSize: "0.9rem" }}>
                    {new Date(therapist.nextAvailableAt).toLocaleString()}
                  </span>
                </div>
                <p style={{ color: "#555", fontSize: "0.95rem", lineHeight: "1.6", margin: 0 }}>
                  {therapist.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
