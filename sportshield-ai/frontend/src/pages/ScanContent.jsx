// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Engine execution path providing immediate feedback mapping exact probabilistic DNA results directly. */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadZone from '../components/features/UploadZone';
import ScanResults from '../components/features/ScanResults';
import { RotateCw } from 'lucide-react';

export default function ScanContent() {
  const [scanResult, setScanResult] = useState(null);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '0.1em' }}>INTELLIGENCE SCANNER</h2>
        {scanResult && (
          <button className="btn btn-outline btn-sm" onClick={() => setScanResult(null)}>
            <RotateCw size={14} /> NEW SCAN
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!scanResult ? (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <UploadZone onScanComplete={setScanResult} />
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ScanResults scanResult={scanResult} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
