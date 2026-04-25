// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: High-level tactical mapping of all active infringement cases with embedded send_takedown integration hooks rendering directly from Firebase. */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ViolationCard from '../components/features/ViolationCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ViolationsFeed() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchV = async () => {
      try {
        const q = query(collection(db, 'violations'), orderBy('detected_at', 'desc'), limit(50));
        const snap = await getDocs(q);
        if (active) setViolations(snap.docs.map(d => d.data()));
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchV();
    return () => { active = false; };
  }, []);

  const handleTakedownSent = (id) => {
    setViolations(prev => prev.map(v => v.violation_id === id ? { ...v, status: 'takedown_sent' } : v));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '0.1em', marginBottom: '24px' }}>VIOLATION INTEL FEED</h2>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><LoadingSpinner /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {violations.map(v => (
            <ViolationCard key={v.violation_id} violation={v} onTakedownSent={handleTakedownSent} />
          ))}
          {violations.length === 0 && <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}>No active violations found in DB logic.</p>}
        </div>
      )}
    </motion.div>
  );
}
