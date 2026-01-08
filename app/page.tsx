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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
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
    <>
      <div className="gradient-bg" />
      <div
        style={{
          minHeight: "100vh",
          padding: "1.5rem 1rem",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {/* Header Section */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "2.5rem",
              animation: "fadeIn 0.8s ease-out",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: "700",
                marginBottom: "0.75rem",
                letterSpacing: "-0.01em",
              }}
            >
              🧠 Therapist Matcher
            </div>
            <p
              style={{
                fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
                color: "var(--text-secondary)",
                maxWidth: "600px",
                margin: "0 auto",
                fontWeight: "400",
                padding: "0 1rem",
              }}
            >
              AI-powered semantic matching to find the perfect therapist for your needs
            </p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              marginBottom: "2.5rem",
              animation: "fadeIn 1s ease-out",
            }}
          >
            <div
              style={{
                background: "var(--surface)",
                borderRadius: "8px",
                padding: "clamp(1.25rem, 3vw, 2rem)",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                border: "1px solid var(--border)",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "clamp(0.95rem, 2vw, 1rem)",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                }}
              >
                How are you feeling today?
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., I've been feeling overwhelmed at work and struggling with sleep..."
                style={{
                  width: "100%",
                  minHeight: "120px",
                  padding: "1rem",
                  fontSize: "1rem",
                  border: "2px solid var(--border)",
                  borderRadius: "6px",
                  fontFamily: "inherit",
                  resize: "vertical",
                  marginBottom: "1.25rem",
                  transition: "border-color 0.2s ease",
                  background: "var(--background)",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--primary)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border)";
                }}
                disabled={loading}
              />
              
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "0.875rem 1.5rem",
                    fontSize: "1rem",
                    fontWeight: "600",
                    background: loading
                      ? "var(--text-secondary)"
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.opacity = "0.9";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        style={{
                          display: "inline-block",
                          width: "16px",
                          height: "16px",
                          border: "2px solid rgba(255, 255, 255, 0.3)",
                          borderTopColor: "white",
                          borderRadius: "50%",
                          animation: "spin 0.6s linear infinite",
                        }}
                      />
                      Finding matches...
                    </>
                  ) : (
                    <>
                      🔍 Find My Match
                    </>
                  )}
                </button>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                    }}
                  >
                    Try:
                  </span>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                      gap: "0.5rem",
                    }}
                  >
                    {[
                      { emoji: "💼", text: "I'm experiencing" },
                      { emoji: "😰", text: "I've been" },
                      { emoji: "💔", text: "relationship conflict" },
                    ].map((example, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setExamplePrompt(
                          idx === 0 ? "I'm experiencing burnout from work" :
                          idx === 1 ? "I've been having panic attacks" :
                          "relationship conflict with my partner"
                        )}
                        disabled={loading}
                        style={{
                          padding: "0.625rem 0.875rem",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: "4px",
                          cursor: loading ? "not-allowed" : "pointer",
                          transition: "all 0.2s ease",
                          color: "var(--text-primary)",
                          textAlign: "left",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        onMouseEnter={(e) => {
                          if (!loading) {
                            e.currentTarget.style.borderColor = "var(--primary)";
                            e.currentTarget.style.background = "rgba(99, 102, 241, 0.05)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--border)";
                          e.currentTarget.style.background = "var(--background)";
                        }}
                      >
                        {example.emoji} {example.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: "1rem 1.25rem",
                background: "#fee2e2",
                border: "1px solid #fca5a5",
                borderRadius: "6px",
                color: "#991b1b",
                marginBottom: "2rem",
                animation: "slideIn 0.3s ease-out",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontWeight: "500",
                fontSize: "0.95rem",
              }}
            >
              <span style={{ fontSize: "1.25rem" }}>⚠️</span>
              {error}
            </div>
          )}

          {/* Results Section */}
          {matches.length > 0 && (
            <div style={{ animation: "fadeIn 0.6s ease-out" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                }}
              >
                <h2
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                    margin: 0,
                  }}
                >
                  Your Top Matches
                </h2>
                <div
                  style={{
                    padding: "0.375rem 0.875rem",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  {matches.length} Results
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "1.25rem",
                }}
              >
                {matches.map((therapist, index) => (
                  <div
                    key={therapist.id}
                    style={{
                      background: "var(--surface)",
                      borderRadius: "8px",
                      padding: "clamp(1.25rem, 3vw, 1.75rem)",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                      border: "1px solid var(--border)",
                      transition: "all 0.2s ease",
                      animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)";
                    }}
                  >
                    {/* Rank Badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "1.25rem",
                        right: "1.25rem",
                        minWidth: "32px",
                        height: "32px",
                        padding: "0 0.5rem",
                        background: index === 0
                          ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                          : index === 1
                          ? "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)"
                          : "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.875rem",
                        fontWeight: "700",
                        color: "white",
                      }}
                    >
                      #{index + 1}
                    </div>

                    <div style={{ marginBottom: "1rem", paddingRight: "50px" }}>
                      <h3
                        style={{
                          fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                          fontWeight: "700",
                          margin: 0,
                          marginBottom: "0.5rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        {therapist.name}
                      </h3>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.375rem",
                          padding: "0.375rem 0.75rem",
                          background: "rgba(99, 102, 241, 0.1)",
                          borderRadius: "4px",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "var(--primary)",
                        }}
                      >
                        ✨ {(therapist.score * 100).toFixed(1)}% Match
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {therapist.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: "0.375rem 0.75rem",
                            background: "var(--background)",
                            border: "1px solid var(--border)",
                            borderRadius: "4px",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            color: "var(--text-primary)",
                          }}
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    <div
                      style={{
                        padding: "0.875rem",
                        background: "var(--background)",
                        borderRadius: "6px",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.5rem",
                          color: "var(--text-secondary)",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          flexWrap: "wrap",
                        }}
                      >
                        <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>📅</span>
                        <div>
                          <strong style={{ color: "var(--text-primary)" }}>Next Available: </strong>
                          {new Date(therapist.nextAvailableAt).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>

                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.95rem",
                        lineHeight: "1.6",
                        margin: 0,
                        marginBottom: "1.25rem",
                      }}
                    >
                      {therapist.bio}
                    </p>

                    <button
                      style={{
                        width: "100%",
                        padding: "0.75rem 1.5rem",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "opacity 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.9";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                      onClick={() => alert("Booking feature coming soon!")}
                    >
                      📞 Book Consultation
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              marginTop: "3rem",
              padding: "1.5rem",
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
            }}
          >
            <p>Powered by OpenAI Embeddings & Semantic Matching</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        @media (min-width: 640px) {
          button[type="button"] {
            white-space: normal;
          }
        }
      `}</style>
    </>
  );
}
