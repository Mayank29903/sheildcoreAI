// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Translates raw Gemini payloads into actionable legal steps, including translation toggles. */
import React from "react";
import { Sparkles, Languages } from "lucide-react";
import ThreatBadge from "../ui/ThreatBadge";

export default function GeminiReport({ report, onLanguageChange }) {
  if (!report) return null;

  return (
    <div className="gemini-panel slide-up">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div className="gemini-header" style={{ marginBottom: 0 }}>
          <Sparkles size={16} className="pulse-gemini" />
          <span>GEMINI 2.0 FLASH — LEGAL ACTION PLAN</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => onLanguageChange("hi")}
            className="btn btn-ghost btn-sm"
            style={{ padding: "4px 8px" }}
          >
            <Languages size={12} /> HI
          </button>
          <button
            onClick={() => onLanguageChange("ta")}
            className="btn btn-ghost btn-sm"
            style={{ padding: "4px 8px" }}
          >
            <Languages size={12} /> TA
          </button>
          <button
            onClick={() => onLanguageChange("en")}
            className="btn btn-ghost btn-sm"
            style={{ padding: "4px 8px" }}
          >
            <Languages size={12} /> EN
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
        <ThreatBadge level={report.threat_level} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--color-text-dim)",
            paddingTop: "2px",
          }}
        >
          {report.summary}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "24px",
        }}
      >
        <div>
          <h5
            className="stat-label"
            style={{ marginBottom: "8px", color: "var(--color-gemini)" }}
          >
            IMMEDIATE ACTION PLAN
          </h5>
          <ol
            style={{
              paddingLeft: "16px",
              color: "var(--color-text)",
              fontSize: "13px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {(report.immediate_actions || []).map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ol>
        </div>
        <div>
          <h5
            className="stat-label"
            style={{ marginBottom: "8px", color: "var(--color-gemini)" }}
          >
            LEGAL SECTIONS
          </h5>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {(report.legal_sections || []).map((sec, i) => (
              <span
                key={i}
                className="badge badge-neutral"
                style={{ color: "var(--color-text)" }}
              >
                {sec}
              </span>
            ))}
          </div>
          <div className="divider-neon" style={{ opacity: 0.3 }} />
          <h5
            className="stat-label"
            style={{ marginBottom: "8px", color: "var(--color-gemini)" }}
          >
            TIMELINE MAP
          </h5>
          <p
            style={{
              color: "var(--color-warn)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
            }}
          >
            {report.estimated_timeline}
          </p>
        </div>
      </div>
    </div>
  );
}
