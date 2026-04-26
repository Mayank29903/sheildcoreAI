// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Standardized spinning Shield indicator with embedded linear gradient animation. */
import React from "react";
import { Shield } from "lucide-react";

export default function LoadingSpinner({ size = 48 }) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "2px solid transparent",
          borderTopColor: "var(--color-neon)",
          borderRightColor: "var(--color-neon)",
          animation: "spin 1s linear infinite",
        }}
      />
      <Shield
        size={size * 0.4}
        style={{ color: "var(--color-neon)" }}
        className="pulse-safe fade-in"
      />
    </div>
  );
}
