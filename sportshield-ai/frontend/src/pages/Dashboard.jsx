// ShieldCore AI | Google Solution Challenge 2026 | First Prize Target
/**
 * WHY: Dashboard is the first thing judges see after login.
 * Added: 24hr Recharts LineChart, live stat cards, global propagation map.
 * Real data from: Firebase RTDB (stats), /analytics (chart), /ws (live feed).
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useViralAlerts } from "../hooks/useViralAlerts";
import { getAnalytics } from "../lib/api";
import StatCard from "../components/ui/StatCard";
import PropagationMap from "../components/features/PropagationMap";
import RealtimeFeed from "../components/features/RealtimeFeed";
import OnboardingModal from "../components/ui/OnboardingModal";
import {
  ShieldCheck,
  Crosshair,
  AlertOctagon,
  Activity,
  TrendingUp,
  Globe,
  Zap,
  TrendingUp as TrendingUpIcon,
  Cpu,
  Scale,
} from "lucide-react";

// Custom tooltip for the chart that matches our dark theme
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "6px",
        padding: "10px 14px",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
      }}
    >
      <p style={{ color: "var(--color-text-dim)", marginBottom: "6px" }}>
        {label}
      </p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, margin: "2px 0" }}>
          {p.name.toUpperCase()}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const stats = useDashboardStats();
  const { currentAlert } = useViralAlerts();
  const [analytics, setAnalytics] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then((res) => setAnalytics(res.data))
      .catch(() => setAnalytics(null))
      .finally(() => setChartLoading(false));
  }, []);

  const hourlyData = analytics?.violations_by_hour || [];
  const topDomains = analytics?.top_infringing_domains || [];
  const sportBreakdown = analytics?.sport_breakdown || {};
  const sportEntries = Object.entries(sportBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: "flex", flexDirection: "column", gap: "24px" }}
    >
      {/* ── ONBOARDING MODAL ── */}
      <OnboardingModal navigate={navigate} />

      {/* ── VIRAL SPREAD BANNER ── */}
      {currentAlert?.is_active && (
        <div className="viral-banner slide-in">
          <Activity size={24} className="pulse-threat" />
          <div style={{ flex: 1 }}>
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "14px",
                letterSpacing: "0.1em",
              }}
            >
              VIRAL SPREAD DETECTED
            </h4>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                marginTop: "4px",
              }}
            >
              {currentAlert.asset_name} is propagating across unauthorized
              networks — {currentAlert.violations_last_hour} new violations in
              the last hour.
            </p>
          </div>
          <span className="badge badge-critical">
            IMMEDIATE ACTION REQUIRED
          </span>
        </div>
      )}

      {/* ── STAT CARDS ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "24px",
        }}
      >
        <StatCard
          value={stats.total_assets}
          label="SECURITIZED ASSETS"
          icon={ShieldCheck}
          color="safe"
        />
        <StatCard
          value={stats.total_scans}
          label="SCANS TODAY"
          icon={Crosshair}
          color="info"
        />
        <StatCard
          value={stats.total_violations}
          label="THREATS DETECTED"
          icon={AlertOctagon}
          color="threat"
        />
        <StatCard
          value={stats.total_value_protected}
          label="VALUE PROTECTED"
          icon={Activity}
          color="warn"
          prefix="$"
        />
      </div>

      {/* ── SDG IMPACT METRICS ── */}
      <div className="dashboard-sdg-grid" style={{ gap: "20px" }}>
        {[
          {
            sdg: "SDG 8",
            title: "RIGHTS VALUE PROTECTED",
            value: stats.total_value_protected
              ? `$${Number(stats.total_value_protected).toLocaleString()}`
              : "$0",
            icon: TrendingUpIcon,
            color: "var(--color-neon)",
            desc: "Decent Work & Economic Growth",
          },
          {
            sdg: "SDG 9",
            title: "AI SCANS COMPLETED",
            value: stats.total_scans || 0,
            icon: Cpu,
            color: "var(--color-info)",
            desc: "Industry Innovation & Infrastructure",
          },
          {
            sdg: "SDG 16",
            title: "VIOLATIONS FLAGGED",
            value: stats.total_violations || 0,
            icon: Scale,
            color: "var(--color-warn)",
            desc: "Peace, Justice & Strong Institutions",
          },
        ].map((item) => (
          <div
            key={item.sdg}
            className="card"
            style={{ padding: "20px", position: "relative", overflow: "hidden" }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: item.color,
                boxShadow: `0 0 10px ${item.color}`,
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <item.icon size={16} style={{ color: item.color }} />
              <span
                className="badge badge-neutral"
                style={{ fontSize: "9px", letterSpacing: "0.1em" }}
              >
                {item.sdg}
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 800,
                color: item.color,
                textShadow: `0 0 20px ${item.color}40`,
              }}
            >
              {item.value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "var(--color-text-ghost)",
                letterSpacing: "0.08em",
                marginTop: "4px",
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "var(--color-text-ghost)",
                marginTop: "8px",
                opacity: 0.6,
              }}
            >
              {item.desc}
            </div>
          </div>
        ))}
      </div>

      {/* ── 24HR VIOLATIONS CHART + DOMAINS ── */}
      <div className="dashboard-chart-grid" style={{ gap: "24px" }}>
        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <TrendingUp size={16} style={{ color: "var(--color-neon)" }} />
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                letterSpacing: "0.1em",
              }}
            >
              24-HOUR THREAT TIMELINE
            </h4>
          </div>
          {chartLoading ? (
            <div
              style={{
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  color: "var(--color-text-ghost)",
                }}
              >
                LOADING TELEMETRY...
              </span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={hourlyData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorViolations"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-threat)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-threat)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="colorDeepfakes"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-warn)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-warn)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="hour"
                  tick={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    fill: "var(--color-text-ghost)",
                  }}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
                />
                <YAxis
                  tick={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    fill: "var(--color-text-ghost)",
                  }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    paddingTop: "8px",
                  }}
                  formatter={(v) => v.toUpperCase()}
                />
                <Area
                  type="monotone"
                  dataKey="violations"
                  stroke="var(--color-threat)"
                  fill="url(#colorViolations)"
                  strokeWidth={2}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="deepfakes"
                  stroke="var(--color-warn)"
                  fill="url(#colorDeepfakes)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top infringing domains */}
        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <Globe size={16} style={{ color: "var(--color-threat)" }} />
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                letterSpacing: "0.1em",
              }}
            >
              TOP THREAT DOMAINS
            </h4>
          </div>
          {topDomains.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--color-text-ghost)",
              }}
            >
              No crawl violations detected yet.
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {topDomains.map((d, i) => (
                <div
                  key={d.domain}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      color: "var(--color-text-ghost)",
                      width: "16px",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        color: "var(--color-text)",
                        marginBottom: "3px",
                      }}
                    >
                      {d.domain}
                    </div>
                    <div
                      style={{
                        height: "3px",
                        borderRadius: "2px",
                        background: `linear-gradient(90deg, var(--color-threat) ${Math.min(100, (d.count / (topDomains[0]?.count || 1)) * 100)}%, var(--color-border) 0%)`,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: "var(--color-threat)",
                      fontWeight: 700,
                    }}
                  >
                    {d.count}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Sport breakdown */}
          {sportEntries.length > 0 && (
            <div
              style={{
                marginTop: "24px",
                paddingTop: "16px",
                borderTop: "1px solid var(--color-border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <Zap size={13} style={{ color: "var(--color-neon)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    color: "var(--color-text-dim)",
                  }}
                >
                  MOST TARGETED SPORTS
                </span>
              </div>
              {sportEntries.map(([sport, count]) => (
                <div
                  key={sport}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: "var(--color-text-dim)",
                    }}
                  >
                    {sport}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: "var(--color-neon)",
                      fontWeight: 700,
                    }}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── MAP + LIVE FEED ── */}
      <div className="dashboard-bottom-grid" style={{ gap: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card">
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "13px",
                letterSpacing: "0.1em",
                marginBottom: "16px",
              }}
            >
              GLOBAL PROPAGATION MATRIX
            </h4>
            <PropagationMap />
          </div>
        </div>
        <RealtimeFeed />
      </div>
    </motion.div>
  );
}
