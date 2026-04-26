// ShieldCore AI | Google Solution Challenge 2026 | First Prize Target
/**
 * WHY: UploadZone now supports two modes:
 *  - liteMode=false (default) → POST /scan/  — all 6 AI engines, WebSocket progress
 *  - liteMode=true            → POST /scan/lite — pHash+EXIF+watermark, instant result
 * The lite path skips WebSocket entirely; result comes synchronously in the POST response.
 */
import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Shield, UploadCloud, CheckCircle, Zap } from "lucide-react";
import { scanContent, scanLite } from "../../lib/api";
import { useScanProgress } from "../../hooks/useScanProgress";
import { db, doc, getDoc } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth";

// Lite-mode result display (synchronous, no WebSocket needed)
function LiteResult({ result, onRetryFull }) {
  const isMatch = result?.asset_match_found;
  const score = result?.trust_score ?? 0;
  const color =
    score >= 70
      ? "var(--color-neon)"
      : score >= 40
        ? "var(--color-warn)"
        : "var(--color-threat)";

  return (
    <div
      className="card scale-reveal"
      style={{ display: "flex", flexDirection: "column", gap: "20px" }}
    >
      {/* Bandwidth saved banner */}
      <div
        style={{
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: "8px",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Zap size={15} style={{ color: "var(--color-neon)", flexShrink: 0 }} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--color-neon)",
          }}
        >
          LITE MODE — ~95% bandwidth saved · pHash + EXIF + Watermark only
        </span>
      </div>

      {/* Score + verdict */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: `3px solid ${color}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: `${color}14`,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "22px",
              fontWeight: 700,
              color,
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "8px",
              color: "var(--color-text-ghost)",
            }}
          >
            TRUST
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "16px",
              letterSpacing: "0.08em",
              color,
            }}
          >
            {result.threat_level} RISK
          </span>
          {isMatch && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "6px",
                padding: "6px 12px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--color-threat)",
                }}
              >
                ⚠ ASSET MATCH: {result.matched_asset_name} (
                {result.similarity_percent?.toFixed(1)}% similar)
              </span>
            </div>
          )}
          {result.watermark_found && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--color-neon)",
              }}
            >
              ✓ Watermark cert found: {result.watermark_cert_id}
            </span>
          )}
          {result.exif_flags?.length > 0 && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--color-warn)",
              }}
            >
              ⚡ EXIF flags: {result.exif_flags.join(", ")}
            </span>
          )}
        </div>
      </div>

      {/* Note + upgrade prompt */}
      <div
        style={{
          borderTop: "1px solid var(--color-border)",
          paddingTop: "16px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--color-text-ghost)",
            marginBottom: "12px",
          }}
        >
          {result.note}
        </p>
        <button
          className="btn btn-outline"
          style={{ fontSize: "11px" }}
          onClick={onRetryFull}
        >
          <Shield size={13} /> RUN FULL SCAN WITH AI ENGINES
        </button>
      </div>
    </div>
  );
}

export default function UploadZone({ onScanComplete, liteMode = false }) {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanId, setScanId] = useState(null);
  const [liteResult, setLiteResult] = useState(null);
  const [liteLoading, setLiteLoading] = useState(false);
  const { steps, isComplete } = useScanProgress(liteMode ? null : scanId);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles.length) return;
      const f = acceptedFiles[0];
      setFile(f);
      setLiteResult(null);
      setScanId(null);
      setPreview(URL.createObjectURL(f));

      const formData = new FormData();
      formData.append("file", f);
      formData.append("user_uid", user?.uid || "anonymous");
      if (!liteMode) formData.append("language", "en");

      if (liteMode) {
        setLiteLoading(true);
        try {
          const res = await scanLite(formData);
          setLiteResult(res.data);
          // Also surface through onScanComplete so parent can show lite result
          onScanComplete?.(res.data);
        } catch (err) {
          console.error(err);
          alert(
            "Lite scan failed: " + (err?.response?.data?.detail || err.message),
          );
        } finally {
          setLiteLoading(false);
        }
      } else {
        try {
          const res = await scanContent(formData);
          setScanId(res.data.scan_id);
        } catch (err) {
          console.error(err);
          alert(
            "Upload failed: " + (err?.response?.data?.detail || err.message),
          );
        }
      }
    },
    [user, liteMode, onScanComplete],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      "video/*": [".mp4"],
    },
    maxFiles: 1,
  });

  // Full-scan: when all WebSocket steps complete, fetch from Firestore
  useEffect(() => {
    if (!liteMode && isComplete && scanId) {
      getDoc(doc(db, "scans", scanId)).then((snap) => {
        if (snap.exists()) onScanComplete?.(snap.data());
      });
    }
  }, [liteMode, isComplete, scanId, onScanComplete]);

  // ── Lite result display ───────────────────────────────────────────────
  if (liteMode && liteResult) {
    return (
      <LiteResult
        result={liteResult}
        onRetryFull={() => {
          setLiteResult(null);
          setFile(null);
        }}
      />
    );
  }

  // ── Drop zone (no file chosen yet) ────────────────────────────────────
  if (!file || (!scanId && !liteLoading)) {
    return (
      <div
        {...getRootProps()}
        className={`upload-zone ${isDragActive ? "drag-active" : ""}`}
      >
        <input {...getInputProps()} />
        <UploadCloud size={48} className="upload-icon" />
        <h3
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
            letterSpacing: "0.1em",
          }}
        >
          DROP DIGITAL ASSET HERE
        </h3>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--color-text-ghost)",
          }}
        >
          {liteMode
            ? "LITE MODE — pHash + EXIF only · Works on 2G · PNG, JPG, WEBP"
            : "Supports PNG, JPEG, WEBP, MP4 via Secure Channel"}
        </p>
        {liteMode && (
          <span
            style={{
              marginTop: "8px",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              padding: "3px 10px",
              borderRadius: "99px",
              background: "rgba(245,158,11,0.1)",
              color: "var(--color-warn)",
              border: "1px solid rgba(245,158,11,0.3)",
            }}
          >
            LOW BANDWIDTH MODE ACTIVE
          </span>
        )}
      </div>
    );
  }

  // ── Lite loading spinner ───────────────────────────────────────────────
  if (liteMode && liteLoading) {
    return (
      <div
        className="card"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          padding: "48px",
        }}
      >
        <Zap
          size={32}
          style={{ color: "var(--color-warn)" }}
          className="pulse-safe"
        />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            letterSpacing: "0.1em",
          }}
        >
          RUNNING LITE ANALYSIS...
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--color-text-ghost)",
          }}
        >
          pHash · EXIF · Watermark · No heavy AI
        </span>
      </div>
    );
  }

  // ── Full-scan progress ────────────────────────────────────────────────
  const stepKeys = [
    "deepfake",
    "audio_sync",
    "exif",
    "registry",
    "watermark",
    "gemini_vision",
  ];
  const stepLabels = {
    deepfake: "DEEPFAKE AI MODEL",
    audio_sync: "AUDIO-VISUAL SYNC",
    exif: "EXIF FORENSICS",
    registry: "PHASH REGISTRY",
    watermark: "LSB WATERMARK",
    gemini_vision: "GEMINI VISION",
  };

  return (
    <div
      className="card scale-reveal"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(200px, 300px) 1fr",
        gap: "24px",
      }}
    >
      {/* Preview */}
      <div
        style={{
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid var(--color-border)",
          height: "200px",
        }}
      >
        {preview &&
          (file?.type.startsWith("video/") ? (
            <video
              src={preview}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={preview}
              alt="Target"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ))}
        {!isComplete && <div className="scan-line" />}
      </div>

      {/* Steps */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            letterSpacing: "0.1em",
            color: "var(--color-neon)",
            marginBottom: "16px",
          }}
          className={!isComplete ? "cursor-blink" : ""}
        >
          {isComplete
            ? "ANALYSIS COMPLETE"
            : "INITIALIZING PROBABILISTIC LOGIC..."}
        </h3>
        <div className="stagger">
          {stepKeys.map((key) => {
            const status = steps[key];
            const isDone = status === "done";
            const isGemini = key === "gemini_vision";
            return (
              <div key={key} className="analysis-row slide-up">
                <div
                  className="analysis-icon"
                  style={{
                    background: isDone
                      ? isGemini
                        ? "rgba(168,85,247,0.1)"
                        : "rgba(0,212,170,0.1)"
                      : "var(--color-surface)",
                  }}
                >
                  {isDone ? (
                    <CheckCircle
                      size={14}
                      style={{
                        color: isGemini
                          ? "var(--color-gemini)"
                          : "var(--color-neon)",
                      }}
                    />
                  ) : (
                    <Shield
                      size={14}
                      style={{ color: "var(--color-text-ghost)" }}
                    />
                  )}
                </div>
                <div className="analysis-label">
                  {stepLabels[key] || key.replace("_", " ")}
                </div>
                <div className="analysis-bar-track">
                  <div
                    className={`analysis-bar-fill ${status || ""} ${isGemini ? "purple" : ""}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
