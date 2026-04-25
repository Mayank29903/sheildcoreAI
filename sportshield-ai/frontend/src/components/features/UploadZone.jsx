// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Handles dropping target media, visual preview, and initiates the pipeline displaying the step-by-step radar status. */
import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Shield, UploadCloud, CheckCircle } from 'lucide-react';
import { scanContent } from '../../lib/api';
import { useScanProgress } from '../../hooks/useScanProgress';
import { db, doc, getDoc } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';

export default function UploadZone({ onScanComplete }) {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanId, setScanId] = useState(null);
  const { steps, isComplete } = useScanProgress(scanId);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const f = acceptedFiles[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
    
    const formData = new FormData();
    formData.append('file', f);
    formData.append('user_uid', user?.uid || 'anonymous');
    formData.append('language', 'en');

    try {
      const res = await scanContent(formData);
      setScanId(res.data.scan_id);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  }, [user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': ['.png', '.jpg', '.jpeg', '.webp'], 'video/*': ['.mp4']} });

  useEffect(() => {
    if (isComplete && scanId) {
      getDoc(doc(db, 'scans', scanId)).then(snap => {
        if (snap.exists()) onScanComplete(snap.data());
      });
    }
  }, [isComplete, scanId, onScanComplete]);

  if (!scanId) {
    return (
      <div {...getRootProps()} className={`upload-zone ${isDragActive ? 'drag-active' : ''}`}>
        <input {...getInputProps()} />
        <UploadCloud size={48} className="upload-icon" />
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)', letterSpacing: '0.1em' }}>DROP DIGITAL ASSET HERE</h3>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-ghost)' }}>Supports PNG, JPEG, WEBP, MP4 via Secure Channel</p>
      </div>
    );
  }

  const stepKeys = ['deepfake', 'audio_sync', 'exif', 'registry', 'watermark', 'gemini_vision'];

  return (
    <div className="card scale-reveal" style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 300px) 1fr', gap: '24px' }}>
      <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)', height: '200px' }}>
        {preview && (file?.type.startsWith('video/') ? (
          <video src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop autoPlay playsInline />
        ) : (
          <img src={preview} alt="Target" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ))}
        {!isComplete && <div className="scan-line" />}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '0.1em', color: 'var(--color-neon)', marginBottom: '16px' }} className={!isComplete ? 'cursor-blink' : ''}>
          {isComplete ? 'ANALYSIS COMPLETE' : 'INITIALIZING PROBABILISTIC LOGIC...'}
        </h3>
        <div className="stagger">
          {stepKeys.map(key => {
            const status = steps[key];
            const isDone = status === 'done';
            const isRun = status === 'running';
            const isGemini = key === 'gemini_vision';
            return (
              <div key={key} className="analysis-row slide-up">
                <div className="analysis-icon" style={{ background: isDone ? (isGemini ? 'rgba(168,85,247,0.1)' : 'rgba(0,212,170,0.1)') : 'var(--color-surface)' }}>
                  {isDone ? <CheckCircle size={14} style={{ color: isGemini ? 'var(--color-gemini)' : 'var(--color-neon)' }} /> : <Shield size={14} style={{ color: 'var(--color-text-ghost)' }} />}
                </div>
                <div className="analysis-label">{key.replace('_', ' ')}</div>
                <div className="analysis-bar-track">
                  <div className={`analysis-bar-fill ${status} ${isGemini?'purple':''}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
