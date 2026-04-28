// ShieldCore AI | Google Solution Challenge 2026 | First Prize Target
/**
 * WHY: The Content Registry page shows all registered assets.
 * Blueprint Module 8 requires GET /assets be surfaced in the UI.
 * Judges need to see the "registered originals" before running the demo scan.
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAssets, crawlAsset } from "../lib/api";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import CertCard from "../components/ui/CertCard";
import {
  Database,
  ShieldCheck,
  Search,
  RefreshCw,
  Crosshair,
  Globe,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

const SportBadge = ({ sport }) => {
  const colors = {
    IPL: "#f59e0b",
    Cricket: "#10b981",
    FIFA: "#3b82f6",
    Olympics: "#8b5cf6",
    NBA: "#f97316",
    F1: "#ef4444",
    Athletics: "#06b6d4",
    Other: "#6b7280",
  };
  const c = colors[sport] || colors.Other;
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        padding: "2px 10px",
        borderRadius: "99px",
        background: `${c}22`,
        color: c,
        border: `1px solid ${c}44`,
      }}
    >
      {sport}
    </span>
  );
};

const AssetCard = ({ asset, onCrawl, crawling }) => (
  <motion.div
    className="card"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    style={{ display: "flex", flexDirection: "column", gap: "14px" }}
  >
    {/* Header */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            background: "var(--color-neon-glow)",
            border: "1px solid var(--color-neon)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ShieldCheck size={18} style={{ color: "var(--color-neon)" }} />
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "14px",
              letterSpacing: "0.05em",
              fontWeight: 700,
            }}
          >
            {asset.asset_name || "Unnamed Asset"}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--color-text-ghost)",
              marginTop: "2px",
            }}
          >
            {asset.organization || "Unknown Org"}
          </div>
        </div>
      </div>
      <SportBadge sport={asset.sport_category || "Other"} />
    </div>

    {/* Cert ID */}
    <div
      style={{
        background: "rgba(0,240,170,0.05)",
        border: "1px solid rgba(0,240,170,0.15)",
        borderRadius: "6px",
        padding: "10px 14px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          color: "var(--color-text-ghost)",
          letterSpacing: "0.1em",
          marginBottom: "4px",
        }}
      >
        CERT ID
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "16px",
          fontWeight: 700,
          color: "var(--color-neon)",
          letterSpacing: "0.1em",
          wordBreak: "break-all",
        }}
      >
        {asset.cert_id || "—"}
      </div>
    </div>

    {/* Meta */}
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {[
        ["OWNER", asset.owner_name],
        ["VIOLATIONS", asset.total_violations ?? 0],
        [
          "EST. VALUE",
          `$${asset.estimated_rights_value_usd?.toLocaleString() || "0"}`,
        ],
      ].map(([label, val]) => (
        <div
          key={label}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--color-text-ghost)",
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--color-text)",
              fontWeight: 600,
            }}
          >
            {val}
          </span>
        </div>
      ))}
    </div>

    {/* Actions */}
    <div style={{ display: "flex", gap: "8px", marginTop: "4px", flexWrap: "wrap" }}>
      <button
        className="btn btn-outline btn-sm"
        style={{ flex: 1, fontSize: "10px" }}
        onClick={() => onCrawl(asset.asset_id)}
        disabled={crawling === asset.asset_id}
        title="Searches the web for unauthorized copies of this asset using Google Custom Search API"
      >
        {crawling === asset.asset_id ? (
          <>
            <RefreshCw size={11} className="spin" /> CRAWLING...
          </>
        ) : (
          <>
            <Search size={11} /> HUNT STOLEN COPIES
          </>
        )}
      </button>
    </div>
  </motion.div>
);

export default function AssetsRegistry() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [crawling, setCrawling] = useState(null);
  const navigate = useNavigate();

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await getAssets();
      setAssets(res.data.assets || []);
    } catch {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleCrawl = async (assetId) => {
    setCrawling(assetId);
    try {
      const res = await crawlAsset(assetId, 10);
      const found = res.data.violations_found;
      toast.success(
        `Crawl complete: ${found} violation${found !== 1 ? "s" : ""} found`,
      );
      fetchAssets();
    } catch {
      toast.error("Crawl failed");
    } finally {
      setCrawling(null);
    }
  };

  const filtered = assets.filter(
    (a) =>
      !search ||
      [
        a.asset_name,
        a.organization,
        a.sport_category,
        a.cert_id,
        a.owner_name,
      ].some((v) => v?.toLowerCase().includes(search.toLowerCase())),
  );

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
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(0,240,170,0.12)",
              border: "1px solid rgba(0,240,170,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Database size={24} style={{ color: "var(--color-neon)" }} />
          </div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                letterSpacing: "0.1em",
                margin: 0,
              }}
            >
              CONTENT REGISTRY
            </h2>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--color-text-ghost)",
                margin: 0,
                letterSpacing: "0.08em",
              }}
            >
              {assets.length} REGISTERED DIGITAL ASSETS
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button className="btn btn-outline btn-sm" onClick={fetchAssets}>
            <RefreshCw size={13} /> REFRESH
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/register")}
          >
            <Plus size={14} /> REGISTER ASSET
          </button>
        </div>
      </div>

      {/* ── SEARCH ── */}
      <div style={{ position: "relative" }}>
        <Search
          size={15}
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--color-text-ghost)",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          placeholder="Search assets by name, org, category, cert ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            paddingLeft: "40px",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* ── ASSET GRID ── */}
      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "80px" }}
        >
          <LoadingSpinner size={48} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: "60px", textAlign: "center" }}>
          <Database
            size={40}
            style={{ color: "var(--color-text-ghost)", marginBottom: "16px" }}
          />
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "16px",
              letterSpacing: "0.1em",
              marginBottom: "8px",
            }}
          >
            {search ? "NO MATCHING ASSETS" : "REGISTRY EMPTY"}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--color-text-ghost)",
              marginBottom: "24px",
            }}
          >
            {search
              ? "Try clearing the search."
              : "Register your first asset to start protecting it."}
          </p>
          {!search && (
            <button
              className="btn btn-primary"
              onClick={() => navigate("/register")}
            >
              <Plus size={14} /> REGISTER FIRST ASSET
            </button>
          )}
        </div>
      ) : (
        <div className="assets-grid" style={{ gap: "20px" }}>
          <AnimatePresence>
            {filtered.map((a) => (
              <AssetCard
                key={a.asset_id}
                asset={a}
                onCrawl={handleCrawl}
                crawling={crawling}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
