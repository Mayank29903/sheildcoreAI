// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Parses JSON Fact Check payload connecting claims instantly exposing verification against open source truth sources. */
import React from "react";
import { Verified, ExternalLink } from "lucide-react";

export default function FactCheckPanel({ claims = [] }) {
  if (!claims || claims.length === 0) return null;

  return (
    <div
      className="card slide-up"
      style={{ borderLeft: "4px solid var(--color-info)" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <Verified size={18} style={{ color: "var(--color-info)" }} />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "var(--color-info)",
          }}
        >
          GOOGLE FACT CHECK TOOLS
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {claims.map((claim, idx) => (
          <div
            key={idx}
            style={{
              background: "var(--color-surface)",
              padding: "12px",
              borderRadius: "6px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--color-text)",
                marginBottom: "8px",
              }}
            >
              "{claim.claim_text}"
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="badge badge-info">{claim.rating}</span>
              <a
                href={claim.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "var(--color-neon)",
                  textDecoration: "none",
                }}
              >
                SOURCE <ExternalLink size={10} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
