// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Condenses and visually formats long hashes making them aesthetically readable inside small panels. */
import React from 'react';
import { Fingerprint } from 'lucide-react';

export default function HashDisplay({ label, hashValue }) {
  const displayVal = hashValue ? (hashValue.length > 20 ? `${hashValue.substring(0,8)}...${hashValue.substring(hashValue.length-8)}` : hashValue) : 'N/A';
  return (
    <div className="hash-chip" title={hashValue}>
      <Fingerprint size={12} style={{ color: 'var(--color-text-ghost)' }} />
      <span style={{ color: 'var(--color-text-ghost)', marginRight: '4px' }}>{label}:</span>
      {displayVal}
    </div>
  );
}
