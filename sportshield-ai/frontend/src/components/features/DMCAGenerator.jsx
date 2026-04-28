// ShieldCore AI | Google Solution Challenge 2026 | First Prize Target
/**
 * FEAT-002: DMCA Takedown Notice Generator
 * WHY: Detection without action is useless. This closes the loop from
 * detecting a violation to generating a legally valid takedown notice.
 * Uses Gemini AI to produce a professional DMCA notice.
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Copy, Check, Download, X, Globe } from "lucide-react";
import { generateDMCA } from "../../lib/api";
import toast from "react-hot-toast";

const LANGUAGES = [
  { code: "en", label: "ENGLISH" },
  { code: "hi", label: "HINDI" },
  { code: "ta", label: "TAMIL" },
];

export default function DMCAGenerator({ violationId, onGenerated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const [language, setLanguage] = useState("en");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    toast.loading("Generating DMCA notice via Gemini AI...", { id: "dmca" });
    try {
      const res = await generateDMCA(violationId, language);
      setNotice(res.data);
      toast.success("DMCA notice generated", { id: "dmca" });
      if (onGenerated) onGenerated(res.data);
    } catch (err) {
      toast.error("Failed to generate DMCA notice", { id: "dmca" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (notice?.notice_text) {
      navigator.clipboard.writeText(notice.notice_text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    if (!notice?.notice_text) return;
    const blob = new Blob([notice.notice_text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dmca_notice_${violationId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <button
        className="btn btn-danger btn-sm"
        onClick={() => setOpen(true)}
        style={{ fontSize: "10px", gap: "5px" }}
      >
        <FileText size={12} /> GENERATE DMCA
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(3,7,18,0.9)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="card"
              style={{
                maxWidth: "640px",
                width: "90%",
                maxHeight: "80vh",
                overflow: "auto",
                padding: "32px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "16px",
                    letterSpacing: "0.1em",
                    color: "var(--color-threat)",
                    margin: 0,
                  }}
                >
                  DMCA TAKEDOWN NOTICE
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-text-ghost)",
                    cursor: "pointer",
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Language selector */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "20px",
                  alignItems: "center",
                }}
              >
                <Globe
                  size={14}
                  style={{ color: "var(--color-text-ghost)" }}
                />
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    className={`btn btn-sm ${language === l.code ? "btn-primary" : "btn-outline"}`}
                    style={{ fontSize: "10px", padding: "4px 10px" }}
                    onClick={() => setLanguage(l.code)}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Generate button */}
              {!notice && (
                <button
                  className="btn btn-danger"
                  style={{ width: "100%" }}
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? "GENERATING VIA GEMINI..." : "GENERATE DMCA NOTICE"}
                </button>
              )}

              {/* Generated notice */}
              {notice && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* Meta info */}
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    {notice.subject_line && (
                      <span className="badge badge-critical">
                        {notice.subject_line}
                      </span>
                    )}
                    {notice.platform_email && (
                      <span className="badge badge-info">
                        → {notice.platform_email}
                      </span>
                    )}
                  </div>

                  {/* Notice text */}
                  <textarea
                    readOnly
                    value={notice.notice_text || ""}
                    style={{
                      width: "100%",
                      height: "280px",
                      background: "rgba(0,0,0,0.4)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      padding: "16px",
                      color: "var(--color-text)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      lineHeight: 1.6,
                      resize: "vertical",
                    }}
                  />

                  {/* Legal basis */}
                  {notice.legal_basis && (
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        flexWrap: "wrap",
                      }}
                    >
                      {notice.legal_basis.map((law) => (
                        <span key={law} className="badge badge-neutral">
                          {law}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} />
                      )}{" "}
                      {copied ? "COPIED" : "COPY NOTICE"}
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={handleDownloadTxt}
                    >
                      <Download size={12} /> DOWNLOAD .TXT
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={handleGenerate}
                      disabled={loading}
                    >
                      ↻ REGENERATE
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
