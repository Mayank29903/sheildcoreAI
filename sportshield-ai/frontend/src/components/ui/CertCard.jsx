// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Displays the validated DNA identity of an asset utilizing Framer Motion springs for immediate visual gratification. */
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CertCard({ certId, ownerName, org, timestamp }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.92, y: 12 }} 
      animate={{ opacity: 1, scale: 1, y: 0 }} 
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="cert-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', zIndex: 1, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={28} style={{ color: 'var(--color-neon)' }} className="pulse-safe" />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--color-neon)' }}>
            LOCKED & VERIFIED
          </span>
        </div>
        <CheckCircle2 size={24} style={{ color: 'var(--color-neon)', opacity: 0.5 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="cert-id" style={{ marginBottom: '24px' }}>{certId}</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-text-ghost)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Owner Entity</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, color: 'var(--color-text)' }}>{ownerName}</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-text-ghost)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Organization</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, color: 'var(--color-text)' }}>{org}</div>
          </div>
        </div>
        
        <div className="divider-neon" style={{ margin: '20px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-dim)' }}>
            ISSUED BY: SPORTSHIELD AI CORE
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-neon)' }}>
            {new Date(timestamp).toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
