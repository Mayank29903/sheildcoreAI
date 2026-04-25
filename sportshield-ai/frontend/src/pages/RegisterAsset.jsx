// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: The primary ingestion point mapping cryptographic payloads (LSB watermarking & Triple Hash) physically to the database bounds. */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { registerAsset } from '../lib/api';
import CertCard from '../components/ui/CertCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { UploadCloud, FileImage } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterAsset() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ name: '', org: '', category: 'cricket' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Drop target file first');
    setIsRegistering(true);
    setResult(null);

    const data = new FormData();
    data.append('file', file);
    data.append('owner_name', user.displayName || user.email);
    data.append('organization', formData.org);
    data.append('sport_category', formData.category);
    data.append('user_uid', user.uid);
    data.append('asset_name', formData.name);

    try {
      const res = await registerAsset(data);
      setResult(res.data);
      toast.success('Asset Securely Locked');
    } catch (err) {
      toast.error('Registration Integrity Check Failed');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '0.1em', marginBottom: '24px' }}>REGISTER NEW ASSET</h2>
      
      {!result ? (
        <form onSubmit={handleSubmit} className="card">
          <div className="form-group">
            <label>DIGITAL TARGET (PNG PREFERRED FOR WATERMARK RETENTION)</label>
            <div style={{ padding: '40px', border: '2px dashed var(--color-border)', borderRadius: '6px', textAlign: 'center', cursor: 'pointer', background: file ? 'rgba(0,212,170,0.05)' : 'transparent' }} onClick={() => document.getElementById('fileIn').click()}>
              <input id="fileIn" type="file" style={{ display: 'none' }} accept="image/*,video/mp4" onChange={(e) => setFile(e.target.files[0])} />
              {file ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <FileImage size={32} style={{ color: 'var(--color-neon)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-neon)' }}>{file.name}</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--color-text-ghost)' }}>
                  <UploadCloud size={32} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>CLICK TO BIND ASSET</span>
                </div>
              )}
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div className="form-group">
              <label>ASSET DESIGNATION</label>
              <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. IPL Finals Winning Catch" />
            </div>
            <div className="form-group">
              <label>ORGANIZATIONAL ENTITY</label>
              <input type="text" className="form-control" required value={formData.org} onChange={e => setFormData({...formData, org: e.target.value})} placeholder="e.g. BCCI Media Rights" />
            </div>
          </div>

          {isRegistering ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '20px' }}>
              <LoadingSpinner size={40} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-neon)' }} className="cursor-blink">EMBEDDING CRYPTOGRAPHIC WATERMARK...</div>
            </div>
          ) : (
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>INITIATE SECURE REGISTRATION</button>
          )}
        </form>
      ) : (
        <AnimatePresence>
          <CertCard 
            certId={result.watermark_cert_id || result.asset_id}
            ownerName={user.displayName || user.email}
            org={formData.org}
            timestamp={result.registered_at}
          />
        </AnimatePresence>
      )}
    </motion.div>
  );
}
