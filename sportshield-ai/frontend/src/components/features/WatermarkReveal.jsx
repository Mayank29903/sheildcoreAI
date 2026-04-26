// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: The ultimate gasp moment. Decodes ownership LSB signatures directly out of pixel data proving provenance physically. */
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Fingerprint, Award } from "lucide-react";

export default function WatermarkReveal({ steps, watermarkResult }) {
  const status = steps?.watermark || "running";

  return (
    <div
      className="card"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "160px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AnimatePresence mode="wait">
        {status === "running" && (
          <motion.div
            key="running"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glitch"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Fingerprint
              size={32}
              style={{ color: "var(--color-neon)" }}
              className="pulse-safe"
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--color-neon)",
                letterSpacing: "0.2em",
              }}
              className="cursor-blink"
            >
              DECODING STEGANOGRAPHIC LAYER...
            </span>
            <div className="scan-line" />
          </motion.div>
        )}

        {status === "done" && !watermarkResult && (
          <motion.div
            key="not-found"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Lock size={28} style={{ color: "var(--color-text-ghost)" }} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "var(--color-text-dim)",
                letterSpacing: "0.1em",
              }}
            >
              NO OWNERSHIP SIGNATURE DETECTED
            </span>
          </motion.div>
        )}

        {status === "done" && watermarkResult && (
          <motion.div
            key="found"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 18,
              delay: 0.1,
            }}
            style={{ width: "100%", textAlign: "center" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <Award size={24} style={{ color: "var(--color-neon)" }} />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--color-neon)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                SportShield DNA Confirmed
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "28px",
                color: "var(--color-neon)",
                letterSpacing: "0.25em",
                textShadow:
                  "0 0 30px rgba(0,212,170,0.6), 0 0 60px rgba(0,212,170,0.2)",
                marginBottom: "16px",
              }}
            >
              {watermarkResult.cert_id}
            </div>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "24px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span className="stat-label">REGISTERED OWNER</span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "var(--color-text)",
                    fontWeight: 600,
                  }}
                >
                  {watermarkResult.owner_name}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span className="stat-label">ORIGINAL ASSET</span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "var(--color-text)",
                    fontWeight: 600,
                  }}
                >
                  {watermarkResult.asset_name}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

WatermarkReveal.propTypes = {
  steps: PropTypes.object,
  watermarkResult: PropTypes.object,
};
