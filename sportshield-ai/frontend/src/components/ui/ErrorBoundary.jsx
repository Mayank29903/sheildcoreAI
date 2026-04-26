// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Class component ensuring any child exception displays a branded error rather than a dead white screen. */
import React from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="card glow-red slide-up"
          style={{ padding: "40px", textAlign: "center", margin: "24px" }}
        >
          <div
            style={{
              border: "1px solid rgba(255,61,61,0.3)",
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              background: "rgba(255,61,61,0.1)",
            }}
          >
            <AlertTriangle
              size={32}
              style={{ color: "var(--color-threat)" }}
              className="pulse-threat"
            />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-threat)",
              fontSize: "20px",
              letterSpacing: "0.1em",
              marginBottom: "8px",
            }}
          >
            COMPONENT ERROR DETECTED
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-text-dim)",
              fontSize: "11px",
              marginBottom: "24px",
            }}
          >
            {this.state.error?.message ||
              "An unknown framework exception occurred."}
          </p>
          <button
            className="btn btn-outline"
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              borderColor: "var(--color-threat)",
              color: "var(--color-threat)",
            }}
          >
            <RotateCw size={14} /> RELOAD COMPONENT
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
