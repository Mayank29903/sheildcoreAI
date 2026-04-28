// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Universal tracking layout formatting violation instances mapping out direct domain blocks directly pointing to geo points. */
import React from "react";
import ThreatBadge from "../ui/ThreatBadge";
import { Mail, Globe2 } from "lucide-react";
import { sendTakedown } from "../../lib/api";
import toast from "react-hot-toast";
import DMCAGenerator from "./DMCAGenerator";

export default function ViolationCard({ violation, onTakedownSent }) {
  const isDeepfake = violation.is_deepfake;

  const handleTakedown = async () => {
    toast.loading("Sending Secure Takedown Notice...", { id: "takedown" });
    try {
      await sendTakedown(violation.violation_id);
      toast.success("DMCA Notice dispatched reliably.", { id: "takedown" });
      if (onTakedownSent) onTakedownSent(violation.violation_id);
    } catch {
      toast.error("Failure via dispatch loop.", { id: "takedown" });
    }
  };

  return (
    <div
      className={`card ${violation.status === "takedown_sent" ? "" : "glow-red"}`}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        <div>
          <h4
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              fontWeight: 600,
              color: "var(--color-text)",
            }}
          >
            {violation.asset_name}
          </h4>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--color-text-ghost)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            ID: {violation.violation_id.substring(0, 8)} |{" "}
            {violation.sport_category}
          </span>
        </div>
        <ThreatBadge level={isDeepfake ? "CRITICAL" : "HIGH"} />
      </div>

      <div className="divider" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <div>
          <span
            className="stat-label"
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
          >
            <Globe2 size={10} /> DOMAIN
          </span>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              color: "var(--color-text)",
            }}
          >
            {violation.source_domain || "Unknown Source"}
          </div>
        </div>
        <div>
          <span className="stat-label">LOCATION</span>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--color-text)",
            }}
          >
            {violation.geo_city
              ? `${violation.geo_city}, ${violation.geo_country}`
              : "Encrypted Origin"}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        {(violation.detection_type === "theft" || violation.detection_type === "both") && (
          <DMCAGenerator violationId={violation.violation_id} />
        )}
        <button
          className="btn btn-outline"
          onClick={handleTakedown}
          disabled={violation.status === "takedown_sent"}
          style={
            violation.status === "takedown_sent"
              ? { borderColor: "var(--color-safe)", color: "var(--color-safe)" }
              : {}
          }
        >
          <Mail size={14} />
          {violation.status === "takedown_sent"
            ? "NOTICE SENT"
            : "ISSUE C&D TAKEDOWN"}
        </button>
      </div>
    </div>
  );
}
