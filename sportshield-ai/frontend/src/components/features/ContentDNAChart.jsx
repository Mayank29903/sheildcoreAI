// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: The defining SportShield proprietary metric display combining Radar bounds mapping with exact signal breakouts. */
import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { useCountUp } from "../../hooks/useCountUp";

export default function ContentDNAChart({ dnaResult }) {
  if (!dnaResult || !dnaResult.signals) return null;

  const rawScore = dnaResult.dna_score || 0;
  const score = useCountUp(rawScore, 1500);
  const data = Object.keys(dnaResult.signals).map((key) => ({
    subject: key.replace("_", " ").toUpperCase(),
    A: dnaResult.signals[key]?.score || 0,
    fullMark: 100,
  }));

  return (
    <div className="card scale-reveal">
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div>
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "14px",
              letterSpacing: "0.1em",
              color: "var(--color-text)",
            }}
          >
            PROPRIETARY CONTENT DNA
          </h4>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--color-text-ghost)",
            }}
          >
            SPORT-SHIELD 7-SIGNAL METRIC MAP
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "48px",
              fontWeight: 900,
              lineHeight: 1,
              color: dnaResult.color,
              textShadow: `0 0 20px ${dnaResult.color}66`,
            }}
          >
            {score}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: dnaResult.color,
              marginTop: "4px",
            }}
          >
            GRADE: {dnaResult.grade}
          </div>
        </div>
      </div>

      <div style={{ height: 280, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="var(--color-border)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: "var(--color-text-dim)",
                fontSize: 9,
                fontFamily: "var(--font-mono)",
              }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="DNA"
              dataKey="A"
              stroke={dnaResult.color}
              fill={dnaResult.color}
              fillOpacity={0.25}
              style={{ filter: `drop-shadow(0 0 10px ${dnaResult.color}88)` }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="divider" style={{ margin: "24px 0 16px" }} />

      <table className="data-table">
        <thead>
          <tr>
            <th>SIGNAL</th>
            <th>WEIGHT</th>
            <th>SCORE</th>
            <th>INTERPRETATION</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(dnaResult.signals).map(([k, v]) => (
            <tr key={k}>
              <td
                style={{
                  color: "var(--color-text)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {k.replace("_", " ").toUpperCase()}
              </td>
              <td
                style={{
                  color: "var(--color-text-ghost)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {(v.weight * 100).toFixed(0)}%
              </td>
              <td
                style={{
                  color:
                    v.score >= 70
                      ? "var(--color-safe)"
                      : v.score <= 40
                        ? "var(--color-threat)"
                        : "var(--color-warn)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                }}
              >
                {v.score}
              </td>
              <td style={{ color: "var(--color-text-dim)", fontSize: "11px" }}>
                {v.interpretation}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
