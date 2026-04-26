// ShieldCore AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Primary navigation. Added Assets Registry (/assets) link alongside existing routes. */
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Shield,
  Radar,
  AlertTriangle,
  ShieldCheck,
  Database,
  Crosshair,
} from "lucide-react";

export default function Sidebar() {
  const items = [
    { to: "/dashboard", icon: Radar, label: "Dashboard" },
    { to: "/scan", icon: Crosshair, label: "Scan" },
    { to: "/violations", icon: AlertTriangle, label: "Alerts" },
    { to: "/assets", icon: Database, label: "Registry" },
    { to: "/register", icon: ShieldCheck, label: "Register" },
  ];

  return (
    <nav className="sidebar">
      <div style={{ padding: "8px 0", marginBottom: "16px" }}>
        <Shield
          size={28}
          style={{ color: "var(--color-neon)" }}
          className="pulse-safe"
        />
      </div>
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `sidebar-icon ${isActive ? "active" : ""}`
          }
        >
          <Icon size={22} />
          <span className="sidebar-tooltip">{label}</span>
        </NavLink>
      ))}
      <div style={{ flex: 1 }} />
    </nav>
  );
}
