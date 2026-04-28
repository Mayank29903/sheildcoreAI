// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: The primary composite wrapper that builds out the entire Intelligence Layout mapped to parsed helper functions accurately passing DNA, Exam, and Fallbacks native mapping. */
import React, { useState } from "react";
import TrustRing from "../ui/TrustRing";
import EXIFPanel from "./EXIFPanel";
import GeminiReport from "./GeminiReport";
import ContentDNAChart from "./ContentDNAChart";
import ImageComparison from "./ImageComparison";
import ThreatBadge from "../ui/ThreatBadge";
import HashDisplay from "../ui/HashDisplay";
import { getGeminiReport, downloadReport } from "../../lib/api";
import { Download } from "lucide-react";
import toast from "react-hot-toast";

const buildDnaResult = (scanResult) => {
  if (!scanResult?.content_dna_score && scanResult?.content_dna_score !== 0)
    return null;
  const signals = scanResult.content_dna_signals || {};
  return {
    dna_score: scanResult.content_dna_score,
    grade: scanResult.content_dna_grade || "UNKNOWN",
    color: scanResult.content_dna_color || "#7a9fc0",
    signals,
    positive_signals: Object.values(signals).filter((s) => s.score >= 70)
      .length,
    negative_signals: Object.values(signals).filter((s) => s.score < 40).length,
    signal_count: Object.keys(signals).length,
  };
};

const buildWatermark = (scanResult) => {
  if (!scanResult?.watermark_found) return null;
  return {
    cert_id: scanResult.watermark_cert_id,
    owner_name: scanResult.watermark_owner_name,
    organization: scanResult.watermark_organization,
    sport_category: scanResult.watermark_sport_category,
    registered_at: scanResult.watermark_registered_at,
    asset_name:
      scanResult.watermark_asset_name || scanResult.matched_asset_name,
    issued_by: scanResult.watermark_issued_by || "SportShield AI v2.0",
  };
};

const buildExifResult = (scanResult) => ({
  flags: scanResult.exif_flags || [],
  risk_score: scanResult.exif_risk_score || 0,
  risk_label: scanResult.exif_risk_label || "LOW",
  exif_data: scanResult.exif_data || {},
  summary: "",
});

export default function ScanResults({ scanResult }) {
  const [report, setReport] = useState(scanResult?.gemini_legal_report);
  const [loadingReport, setLoadingReport] = useState(false);

  React.useEffect(() => {
    if (scanResult && (scanResult.threat_level === "CRITICAL" || scanResult.threat_level === "HIGH")) {
      const msg = scanResult.deepfake_is_fake 
        ? "Critical Alert. Unauthorized deepfake detected. Initiating legal protocol."
        : "Alert. Unauthorized asset use detected. Rights chain violated.";
      const utterance = new SpeechSynthesisUtterance(msg);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, [scanResult]);

  if (!scanResult) return null;

  const dnaResult = buildDnaResult(scanResult);
  const watermark = buildWatermark(scanResult);
  const exifResult = buildExifResult(scanResult);

  const handleLanguageChange = async (lang) => {
    setLoadingReport(true);
    toast.loading(`Drafting Legal Report in ${lang.toUpperCase()}...`, {
      id: "lang",
    });
    try {
      const res = await getGeminiReport(scanResult.scan_id, lang);
      setReport(res.data);
      toast.success(`Success`, { id: "lang" });
    } catch (e) {
      toast.error("Failed to translate", { id: "lang" });
    } finally {
      setLoadingReport(false);
    }
  };

  const handleDownload = async () => {
    toast.loading("Generating Digital Evidence PDF...", { id: "pdf" });
    try {
      const res = await downloadReport(scanResult.scan_id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `evidence_${scanResult.scan_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Downloaded securely", { id: "pdf" });
    } catch {
      toast.error("Failed to generate PDF", { id: "pdf" });
    }
  };

  // FEAT-003: Determine threat verdict
  const getVerdict = () => {
    const isFake = scanResult.deepfake_is_fake;
    const isMatch = scanResult.asset_match_found;
    if (isFake && isMatch)
      return {
        label: "DUAL THREAT DETECTED",
        desc: "Deepfake manipulation AND registered asset theft confirmed. Immediate legal action recommended.",
        color: "var(--color-threat)",
        bg: "rgba(255,42,42,0.1)",
        border: "rgba(255,42,42,0.4)",
        pulse: true,
      };
    if (isFake)
      return {
        label: "DEEPFAKE DETECTED",
        desc: "AI-generated or manipulated content detected with high confidence. This may constitute identity fraud under IT Act 66C.",
        color: "var(--color-threat)",
        bg: "rgba(255,42,42,0.08)",
        border: "rgba(255,42,42,0.3)",
        pulse: false,
      };
    if (isMatch)
      return {
        label: "IP THEFT DETECTED",
        desc: "This content matches a registered asset in the ShieldCore registry. Rights chain violation confirmed.",
        color: "var(--color-warn)",
        bg: "rgba(255,174,0,0.08)",
        border: "rgba(255,174,0,0.3)",
        pulse: false,
      };
    return {
      label: "AUTHENTIC CONTENT",
      desc: "No deepfake manipulation detected. No registry match found. Content appears legitimate.",
      color: "var(--color-neon)",
      bg: "rgba(0,240,255,0.06)",
      border: "rgba(0,240,255,0.3)",
      pulse: false,
    };
  };

  const verdict = getVerdict();

  return (
    <div className="stagger">
      {/* FEAT-003: Threat Verdict Banner */}
      <div
        className={verdict.pulse ? "pulse-threat" : ""}
        style={{
          background: verdict.bg,
          border: `1px solid ${verdict.border}`,
          borderRadius: "var(--radius-card)",
          padding: "20px 24px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: verdict.bg,
            border: `1px solid ${verdict.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "24px" }}>
            {verdict.label.includes("AUTHENTIC") ? "✓" : "⚠"}
          </span>
        </div>
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              color: verdict.color,
              margin: 0,
            }}
          >
            {verdict.label}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--color-text-dim)",
              margin: "4px 0 0",
            }}
          >
            {verdict.desc}
          </p>
        </div>
      </div>

      <div className="scan-results-hero-grid" style={{ gap: "24px", marginBottom: "24px" }}>
        <div
          className="card"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TrustRing score={scanResult.trust_score} />
          <div
            style={{
              marginTop: "24px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <HashDisplay
              label="pHash"
              hashValue={scanResult.matched_asset_id || "UNKNOWN"}
            />
            <button
              className="btn btn-outline"
              style={{ width: "100%", marginTop: "12px" }}
              onClick={handleDownload}
              disabled={loadingReport}
            >
              <Download size={14} /> EXPORT EVIDENCE PDF
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {scanResult.asset_match_found && scanResult.matched_original_url && (
            <ImageComparison
              originalUrl={scanResult.matched_original_url}
              targetUrl={scanResult.scan_file_url}
              similarityScore={scanResult.similarity_percent}
            />
          )}
          <GeminiReport
            report={report}
            onLanguageChange={handleLanguageChange}
          />
        </div>
      </div>

      <div className="scan-results-detail-grid" style={{ gap: "24px" }}>
        <ContentDNAChart dnaResult={dnaResult} />
        <EXIFPanel exifResult={exifResult} />
      </div>
    </div>
  );
}
