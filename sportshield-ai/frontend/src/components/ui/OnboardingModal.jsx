// ShieldCore AI | Google Solution Challenge 2026 | First Prize Target
/**
 * FEAT-001: Onboarding Modal — 3-step wizard shown on first login.
 * WHY: Judges have 5 minutes. Without a guide, they see a dark dashboard
 * with no context and leave. This ensures they understand the flow instantly.
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ScanSearch, AlertTriangle, X, ChevronRight, ChevronLeft } from "lucide-react";

const STEPS = [
  {
    icon: Shield,
    title: "REGISTER YOUR ASSET",
    description:
      "Upload your sports image or video → Fill in owner details → Submit. This creates a cryptographic fingerprint + LSB watermark + SHA-256 certificate stored in our blockchain-ready registry.",
    cta: "Go to Register →",
    route: "/register",
    color: "var(--color-neon)",
  },
  {
    icon: ScanSearch,
    title: "SCAN SUSPICIOUS CONTENT",
    description:
      "Upload any suspicious image or video from the web → Our AI runs 6 parallel checks: Deepfake Detection, EXIF Forensics, pHash Registry Match, Watermark Verification, Gemini Vision, Audio Sync.",
    cta: "Go to Scan →",
    route: "/scan",
    color: "var(--color-info)",
  },
  {
    icon: AlertTriangle,
    title: "TRACK VIOLATIONS",
    description:
      "Every detected violation appears in real-time on the Violations Feed with geo-location, threat level, similarity score, and a downloadable legal evidence PDF under IT Act 2000. Use the crawler to hunt stolen content automatically.",
    cta: "View Violations →",
    route: "/violations",
    color: "var(--color-warn)",
  },
];

const STORAGE_KEY = "shieldcore_onboarded";

export default function OnboardingModal({ navigate }) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const goToRoute = (route) => {
    dismiss();
    if (navigate) navigate(route);
  };

  if (!visible) return null;

  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(3,7,18,0.92)",
        backdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="card"
        style={{
          maxWidth: "520px",
          width: "90%",
          position: "relative",
          padding: "40px",
        }}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            color: "var(--color-text-ghost)",
            cursor: "pointer",
          }}
        >
          <X size={18} />
        </button>

        {/* Step indicator */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? "32px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: i === step ? current.color : "var(--color-border)",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "16px",
                background: `${current.color}15`,
                border: `1px solid ${current.color}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={32} style={{ color: current.color }} />
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                letterSpacing: "0.1em",
                fontWeight: 800,
              }}
            >
              {current.title}
            </h2>

            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                color: "var(--color-text-dim)",
                lineHeight: 1.7,
                maxWidth: "400px",
              }}
            >
              {current.description}
            </p>

            <button
              className="btn btn-outline btn-sm"
              style={{ color: current.color, borderColor: current.color }}
              onClick={() => goToRoute(current.route)}
            >
              {current.cta}
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "32px",
            paddingTop: "20px",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            <ChevronLeft size={14} /> BACK
          </button>

          {step === STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={dismiss}>
              BEGIN MISSION
            </button>
          ) : (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setStep(step + 1)}
            >
              NEXT <ChevronRight size={14} />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
