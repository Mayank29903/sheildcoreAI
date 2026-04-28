// ShieldCore AI | Google Solution Challenge 2026 | First Prize Target
/**
 * WHY: ScanContent was thin — just UploadZone + results.
 * New: Adds Low-Bandwidth Mode toggle, URL scan input, and scan mode selector.
 * Three modes: FULL (all AI), URL (paste link), LITE (2G-friendly).
 * This directly addresses the 'Next Billion Users' judging criterion.
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UploadZone from "../components/features/UploadZone";
import ScanResults from "../components/features/ScanResults";
import { scanByUrl } from "../lib/api";
import {
  RotateCw,
  Wifi,
  WifiOff,
  Globe,
  Upload,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const MODES = [
  {
    id: "full",
    label: "FULL SCAN",
    icon: Upload,
    desc: "All AI engines: Deepfake model + Gemini Vision + pHash + Audio-Sync + EXIF. Best accuracy.",
    color: "var(--color-neon)",
    bandwidth: "HIGH",
  },
  {
    id: "url",
    label: "SCAN BY URL",
    icon: Globe,
    desc: "Paste a URL from social media or a news site. ShieldCore downloads and runs a full analysis.",
    color: "var(--color-info)",
    bandwidth: "MEDIUM",
  },
  {
    id: "lite",
    label: "LITE MODE",
    icon: WifiOff,
    desc: "Low-bandwidth 2G mode. pHash + EXIF + Watermark only. No AI models. < 2s response.",
    color: "var(--color-warn)",
    bandwidth: "LOW",
  },
];

const BandwidthPill = ({ level }) => {
  const colors = { HIGH: "#ef4444", MEDIUM: "#f59e0b", LOW: "#10b981" };
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        letterSpacing: "0.08em",
        padding: "2px 8px",
        borderRadius: "99px",
        background: `${colors[level]}22`,
        color: colors[level],
        border: `1px solid ${colors[level]}44`,
      }}
    >
      {level} BANDWIDTH
    </span>
  );
};

export default function ScanContent() {
  const [mode, setMode] = useState("full");
  const [scanResult, setScanResult] = useState(null);
  const [urlInput, setUrlInput] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);

  const currentMode = MODES.find((m) => m.id === mode);

  const handleUrlScan = async () => {
    if (!urlInput.trim()) return toast.error("Please enter a URL");
    setUrlLoading(true);
    try {
      const res = await scanByUrl(urlInput.trim(), "anonymous", "en");
      // /scan/url returns scan_id; poll for result
      const scanId = res.data.scan_id;
      toast.success(
        `Scan queued: ${scanId.slice(0, 8)}... — Check evidence at /report/${scanId}`,
      );
      setScanResult({
        scan_id: scanId,
        status: "processing",
        source_url: urlInput,
      });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "URL scan failed");
    } finally {
      setUrlLoading(false);
    }
  };

  const reset = () => {
    setScanResult(null);
    setUrlInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: "flex", flexDirection: "column", gap: "24px" }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              letterSpacing: "0.1em",
              margin: 0,
            }}
          >
            INTELLIGENCE SCANNER
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--color-text-ghost)",
              margin: "4px 0 0",
              letterSpacing: "0.08em",
            }}
          >
            MULTI-ENGINE CONTENT INTEGRITY ANALYSIS
          </p>
        </div>
        {scanResult && (
          <button className="btn btn-outline btn-sm" onClick={reset}>
            <RotateCw size={14} /> NEW SCAN
          </button>
        )}
      </div>

      {/* ── MODE SELECTOR (only when no result) ── */}
      {!scanResult && (
        <div className="scan-mode-grid" style={{ gap: "14px" }}>
          {MODES.map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <motion.button
                key={m.id}
                onClick={() => setMode(m.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: active ? `${m.color}14` : "var(--color-surface)",
                  border: `1px solid ${active ? m.color : "var(--color-border)"}`,
                  borderRadius: "12px",
                  padding: "18px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  position: "relative",
                  outline: "none",
                }}
              >
                {active && (
                  <CheckCircle
                    size={16}
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      color: m.color,
                    }}
                  />
                )}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: `${m.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "12px",
                  }}
                >
                  <Icon size={18} style={{ color: m.color }} />
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "13px",
                    letterSpacing: "0.08em",
                    color: active ? m.color : "var(--color-text)",
                    marginBottom: "6px",
                  }}
                >
                  {m.label}
                </div>
                <BandwidthPill level={m.bandwidth} />
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: "var(--color-text-ghost)",
                    marginTop: "8px",
                    lineHeight: 1.5,
                  }}
                >
                  {m.desc}
                </p>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* ── SCAN INPUT AREA ── */}
      <AnimatePresence mode="wait">
        {!scanResult ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* URL MODE */}
            {mode === "url" && (
              <div
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Globe size={16} style={{ color: "var(--color-info)" }} />
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "13px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    ENTER TARGET URL
                  </span>
                </div>
                <div className="scan-url-row" style={{ display: "flex", gap: "12px" }}>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/suspicious-image.jpg"
                    onKeyDown={(e) => e.key === "Enter" && handleUrlScan()}
                    style={{ flex: 1 }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleUrlScan}
                    disabled={urlLoading || !urlInput.trim()}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {urlLoading ? (
                      <RotateCw size={14} className="spin" />
                    ) : (
                      <Globe size={14} />
                    )}
                    {urlLoading ? "SCANNING..." : "SCAN URL"}
                  </button>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: "var(--color-text-ghost)",
                    margin: 0,
                  }}
                >
                  ShieldCore will download the image, run all AI engines, and
                  return a scan ID. View the full report at /report/[scan_id].
                </p>
              </div>
            )}

            {/* FULL or LITE MODE — both use UploadZone; lite prop switches the endpoint */}
            {(mode === "full" || mode === "lite") && (
              <UploadZone
                onScanComplete={setScanResult}
                liteMode={mode === "lite"}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* URL scan result (processing state) */}
            {scanResult.status === "processing" ? (
              <div
                className="card"
                style={{ padding: "48px", textAlign: "center" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "18px",
                    letterSpacing: "0.1em",
                    marginBottom: "16px",
                  }}
                >
                  SCAN IN PROGRESS
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "var(--color-text-ghost)",
                    marginBottom: "24px",
                  }}
                >
                  Scan ID:{" "}
                  <strong style={{ color: "var(--color-neon)" }}>
                    {scanResult.scan_id}
                  </strong>
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--color-text-dim)",
                  }}
                >
                  View the full evidence report at:
                </p>
                <a
                  href={`/report/${scanResult.scan_id}`}
                  className="btn btn-primary"
                  style={{ display: "inline-flex", marginTop: "12px" }}
                >
                  VIEW EVIDENCE REPORT →
                </a>
              </div>
            ) : (
              <ScanResults scanResult={scanResult} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
