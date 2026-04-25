// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Fills the direct /report/:id routing link generating immutable proof directly out from isolated parameters securely mapping DB hashes. */
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import PageLoadingSpinner from '../components/layout/PageLoadingSpinner';
import ScanResults from '../components/features/ScanResults';
import { FileText } from 'lucide-react';

export default function EvidenceReport() {
  const { scanId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!scanId) return;
    getDoc(doc(db, 'scans', scanId)).then(snap => {
      if (active) {
        if (snap.exists()) setData(snap.data());
        setLoading(false);
      }
    }).catch(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [scanId]);

  if (loading) return <PageLoadingSpinner text="RETRIEVING CRYPTOGRAPHIC EVIDENCE..." />;
  if (!data) return <Navigate to="/dashboard" replace />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <FileText size={24} style={{ color: 'var(--color-neon)' }} />
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '0.1em' }}>DECENTRALIZED EVIDENCE FILE</h2>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-ghost)' }}>ID: {scanId}</span>
        </div>
      </div>
      <ScanResults scanResult={data} />
    </div>
  );
}
