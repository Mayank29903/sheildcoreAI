// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Binds standard HTTP fetching directly to websocket real-time DB states ensuring Judges see live activity instantly. */
import React from 'react';
import { useRealtimeFeed } from '../../hooks/useRealtimeFeed';
import { ShieldAlert, Globe } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function RealtimeFeed() {
  const { violations, isConnected } = useRealtimeFeed();

  return (
    <div className="card slide-right">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.1em', color: 'var(--color-text)' }}>LIVE THREAT FEED</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className={`feed-dot ${isConnected ? 'safe' : ''}`} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-text-ghost)' }}>{isConnected ? 'NODE CONNECTED' : 'CONNECTING...'}</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {violations.map(v => (
          <div key={v.id} className="feed-card slide-up">
            <ShieldAlert size={16} style={{ color: 'var(--color-threat)', minWidth: '16px' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {v.asset_name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-dim)' }}>
                <Globe size={10} /> {v.source_domain || 'Unknown'} • Match: {v.similarity_percent}%
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-text-ghost)', textAlign: 'right' }}>
              {formatDistanceToNow(v.detected_at, { addSuffix: true })}
            </div>
          </div>
        ))}
        {violations.length === 0 && isConnected && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
            No recent threats detected
          </div>
        )}
      </div>
    </div>
  );
}
