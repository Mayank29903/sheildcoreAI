// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Displays smooth full-page loading indicators for auth or Suspense boundaries. */
import React from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function PageLoadingSpinner({ text = 'SYSTEM BOOTING...' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '20px', background: 'var(--color-void)' }}>
      <LoadingSpinner />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-neon)', letterSpacing: '0.2em' }} className="cursor-blink">
        {text}
      </div>
    </div>
  );
}
