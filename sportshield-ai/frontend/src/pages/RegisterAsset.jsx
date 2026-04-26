// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: The primary ingestion point mapping cryptographic payloads (LSB watermarking & Triple Hash) physically to the database bounds. */
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { registerAsset } from "../lib/api";
import CertCard from "../components/ui/CertCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  UploadCloud,
  FileImage,
  ShieldCheck,
  Database,
  ScanLine,
} from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterAsset() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    org: "",
    category: "cricket",
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Drop target file first");
    setIsRegistering(true);
    setResult(null);

    const data = new FormData();
    data.append("file", file);
    data.append("owner_name", user.displayName || user.email);
    data.append("owner_email", user.email || "operator@sportshield.ai");
    data.append("organization", formData.org);
    data.append("sport_category", formData.category);
    data.append("content_type_label", file.type || "application/octet-stream");
    data.append("user_uid", user.uid);
    data.append("asset_name", formData.name);

    try {
      const res = await registerAsset(data);
      setResult(res.data);
      toast.success("Asset Securely Locked");
    } catch (err) {
      toast.error("Registration Integrity Check Failed");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "48px",
            height: "48px",
            background: "var(--color-neon-glow)",
            borderRadius: "12px",
            border: "1px solid var(--color-neon)",
          }}
        >
          <ShieldCheck size={24} style={{ color: "var(--color-neon)" }} />
        </div>
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "0.05em",
              color: "var(--color-text)",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            REGISTER <span className="text-gradient">NEW ASSET</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--color-text-dim)",
              letterSpacing: "0.1em",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            Cryptographic Payload Injection & Blockchain Sync
          </p>
        </div>
      </div>

      {!result ? (
        <form onSubmit={handleSubmit} className="card stagger">
          <div className="form-group slide-up" style={{ marginBottom: "32px" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Database size={14} style={{ color: "var(--color-neon)" }} />
              DIGITAL TARGET (PNG PREFERRED FOR WATERMARK RETENTION)
            </label>

            <div
              className={`upload-zone ${isDragging ? "drag-active" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                accept="image/*,video/mp4"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0])
                    setFile(e.target.files[0]);
                }}
              />

              {file ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "16px",
                      background: "var(--color-neon-glow)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid var(--color-neon)",
                    }}
                  >
                    <FileImage
                      size={32}
                      style={{ color: "var(--color-neon)" }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "13px",
                      color: "var(--color-neon)",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {file.name}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--color-text-ghost)",
                    }}
                  >
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for
                    cryptographic injection
                  </span>
                </motion.div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.03)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <UploadCloud size={32} className="upload-icon" />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "16px",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        color: "var(--color-text)",
                        marginBottom: "4px",
                      }}
                    >
                      CLICK OR DRAG TO BIND ASSET
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        color: "var(--color-text-ghost)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Maximum payload size: 50MB
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className="slide-up"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginBottom: "32px",
            }}
          >
            <div className="form-group">
              <label>ASSET DESIGNATION</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. IPL Finals Winning Catch"
              />
            </div>
            <div className="form-group">
              <label>ORGANIZATIONAL ENTITY</label>
              <input
                type="text"
                required
                value={formData.org}
                onChange={(e) =>
                  setFormData({ ...formData, org: e.target.value })
                }
                placeholder="e.g. BCCI Media Rights"
              />
            </div>
          </div>

          <div className="divider slide-up"></div>

          {isRegistering ? (
            <div
              className="slide-up"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                padding: "24px",
                background: "rgba(0, 240, 255, 0.05)",
                borderRadius: "12px",
                border: "1px solid var(--color-neon-glow)",
              }}
            >
              <LoadingSpinner size={48} />
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <ScanLine
                  size={16}
                  className="pulse-safe"
                  style={{ color: "var(--color-neon)" }}
                />
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "var(--color-neon)",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                  }}
                  className="cursor-blink"
                >
                  EMBEDDING CRYPTOGRAPHIC WATERMARK...
                </div>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              className="btn btn-primary slide-up"
              style={{ width: "100%", height: "56px", fontSize: "15px" }}
            >
              <ShieldCheck size={20} />
              INITIATE SECURE REGISTRATION
            </button>
          )}
        </form>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CertCard
              certId={
                result.cert_id || result.watermark_cert_id || result.asset_id
              }
              ownerName={user.displayName || user.email}
              org={formData.org}
              timestamp={result.registered_at}
              assetId={result.asset_id}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}
