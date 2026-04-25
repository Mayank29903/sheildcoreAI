// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Standardized threat badge explicitly parsing standard string grades to uniform colors and sizes. */
import React from 'react';
import { AlertCircle, Shield, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ThreatBadge({ level, size = 12 }) {
  let badgeClass = 'badge-neutral';
  let Icon = Shield;
  let text = level || 'UNKNOWN';

  switch (level?.toUpperCase()) {
    case 'CRITICAL':
      badgeClass = 'badge-critical';
      Icon = AlertCircle;
      break;
    case 'HIGH':
      badgeClass = 'badge-high';
      Icon = AlertTriangle;
      break;
    case 'MEDIUM':
      badgeClass = 'badge-medium';
      Icon = AlertTriangle;
      break;
    case 'LOW':
      badgeClass = 'badge-low';
      Icon = ShieldCheck;
      break;
    case 'DEEPFAKE':
      badgeClass = 'badge-deepfake';
      Icon = AlertCircle;
      break;
    case 'THEFT':
      badgeClass = 'badge-theft';
      Icon = AlertTriangle;
      break;
    default:
      break;
  }

  return (
    <span className={`badge ${badgeClass}`} style={{ gap: '6px' }}>
      <Icon size={size} />
      {text}
    </span>
  );
}
