// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Surfaces stripping or tampering by comparing EXIF payloads transparently with color-coded logic. */
import React from 'react';
import ThreatBadge from '../ui/ThreatBadge';

export default function EXIFPanel({ exifResult }) {
  if (!exifResult) return null;
  const { flags = [], risk_label = 'LOW', exif_data = {} } = exifResult;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '0.1em', color: 'var(--color-text)' }}>EXIF FORENSICS</h4>
        <ThreatBadge level={risk_label} />
      </div>
      
      {flags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {flags.map(f => (
            <span key={f} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '4px 8px', background: 'rgba(255,149,0,0.1)', color: 'var(--color-warn)', border: '1px solid rgba(255,149,0,0.3)', borderRadius: '4px', letterSpacing: '0.05em' }}>
              FLAG: {f}
            </span>
          ))}
        </div>
      )}

      <table className="data-table">
        <tbody>
          {Object.entries(exif_data).slice(0, 5).map(([k, v]) => (
            <tr key={k}>
              <td style={{ color: 'var(--color-text-ghost)', width: '40%' }}>{k}</td>
              <td style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>{String(v)}</td>
            </tr>
          ))}
          {Object.keys(exif_data).length === 0 && (
            <tr><td colSpan={2} style={{ textAlign: 'center', color: 'var(--color-text-ghost)', fontStyle: 'italic' }}>Metadata Stripped / Unavailable</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
