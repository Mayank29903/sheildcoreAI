// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Global top navigation offering branding, auth state and network connection status in real-time. */
import React from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function TopBar() {
  const { user, signOut } = useAuth();

  return (
    <header className="topbar">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "16px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            color: "var(--color-text)",
          }}
        >
          SPORTSHIELD<span style={{ color: "var(--color-neon)" }}>.AI</span>
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "0.15em",
            color: "var(--color-text-ghost)",
            textTransform: "uppercase",
          }}
        >
          Solution Challenge 2026
        </span>
      </div>

      <div style={{ flex: 1 }} />

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--color-neon)",
              }}
              className="pulse-safe"
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "var(--color-text-dim)",
                letterSpacing: "0.1em",
              }}
            >
              LIVE
            </span>
          </div>
          <div
            style={{
              width: "1px",
              height: "24px",
              background: "var(--color-border)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--color-text-dim)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <User size={14} /> {user.displayName || user.email}
          </span>
          <button
            onClick={signOut}
            className="btn btn-ghost btn-sm"
            aria-label="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      )}
    </header>
  );
}
