// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Places the Original Reference alongside the Infringing Asset creating an immediate visual linkage argument directly mapped for the Judge. */
import React from "react";
import { ArrowRightLeft } from "lucide-react";

export default function ImageComparison({
  originalUrl,
  targetUrl,
  similarityScore,
}) {
  if (!originalUrl || !targetUrl) return null;

  return (
    <div className="card fade-in">
      <h4
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "12px",
          letterSpacing: "0.1em",
          color: "var(--color-text)",
          marginBottom: "16px",
        }}
      >
        VISUAL COMPARISON MATRICES
      </h4>

      <div className="compare-container">
        <div className="compare-image-card" style={{ height: "220px" }}>
          <img
            src={originalUrl}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="Original"
          />
          <div
            className="compare-label"
            style={{
              background: "rgba(0,0,0,0.7)",
              color: "var(--color-neon)",
            }}
          >
            DNA REFERENCE
          </div>
        </div>

        <div className="compare-divider">
          <span className="stat-label">CONFIDENCE</span>
          <div
            className="compare-score"
            style={{ color: "var(--color-threat)" }}
          >
            {similarityScore}%
          </div>
          <ArrowRightLeft
            size={20}
            style={{ color: "var(--color-text-ghost)" }}
          />
          <span className="badge badge-critical" style={{ marginTop: "4px" }}>
            MATCH PENDING
          </span>
        </div>

        <div
          className="compare-image-card glow-red"
          style={{ height: "220px" }}
        >
          <img
            src={targetUrl}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="Target"
          />
          <div
            className="compare-label"
            style={{
              background: "rgba(255,61,61,0.2)",
              color: "var(--color-threat)",
              backdropFilter: "blur(4px)",
            }}
          >
            TARGET ASSET
          </div>
        </div>
      </div>
    </div>
  );
}
