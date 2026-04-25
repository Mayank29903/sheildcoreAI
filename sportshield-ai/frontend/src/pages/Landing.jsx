// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: The primary gateway. Handles Auth redirection automatically ensuring organizers route straight into mission control. */
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { ShieldAlert, Fingerprint, Mail, Key } from 'lucide-react';
import PageLoadingSpinner from '../components/layout/PageLoadingSpinner';

export default function Landing() {
  const { user, loading, signIn, signInWithEmail, registerWithEmail, continueAsGuest } = useAuth();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      toast.error(error?.message || 'Authentication failed');
    }
  };

  const handleLocalPreview = async () => {
    try {
      await continueAsGuest();
    } catch (error) {
      toast.error(error?.message || 'Local preview unavailable');
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email and password are required');
      return;
    }
    try {
      if (isRegistering) {
        await registerWithEmail(email, password, displayName);
        toast.success('Registration successful');
      } else {
        await signInWithEmail(email, password);
        toast.success('Signed in successfully');
      }
    } catch (error) {
      toast.error(error?.message || 'Authentication failed');
    }
  };

  if (loading) return <PageLoadingSpinner text="Establishing Secure Connection..." />;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="page" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'radial-gradient(circle at center, rgba(0,212,170,0.05) 0%, var(--color-void) 70%)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="slide-up max-w-[600px] w-full" style={{ padding: '0 20px' }}>
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, filter: 'blur(40px)', background: 'var(--color-neon)', opacity: 0.2, borderRadius: '50%' }} />
          <ShieldAlert size={80} style={{ color: 'var(--color-neon)' }} className="pulse-safe" />
        </div>
        
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '16px', textShadow: '0 0 20px rgba(0,212,170,0.4)' }}>
          SPORTSHIELD<span style={{ color: 'var(--color-neon)' }}>.AI</span>
        </h1>
        
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-text-dim)', marginBottom: '32px', lineHeight: 1.6, letterSpacing: '0.05em' }}>
          Real-time Sports Media Rights Intelligence.<br/>
          Proprietary Contextual DNA. Cryptographic Provenance.
        </p>

        <div className="card" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
          <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--color-neon)', textAlign: 'center', marginBottom: '8px', letterSpacing: '0.1em' }}>
              {isRegistering ? 'INITIALIZE OPERATOR' : 'OPERATOR LOGIN'}
            </h2>
            
            {isRegistering && (
              <div className="form-group">
                <label>Operator Name</label>
                <input 
                  type="text" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)} 
                  placeholder="John Doe" 
                />
              </div>
            )}
            
            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="operator@sportshield.ai" 
                  style={{ paddingLeft: '36px' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-ghost)' }} />
              </div>
            </div>
            
            <div className="form-group">
              <label>Passcode</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  style={{ paddingLeft: '36px' }}
                />
                <Key size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-ghost)' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              {isRegistering ? 'REGISTER' : 'AUTHENTICATE'}
            </button>

            <button 
              type="button" 
              onClick={() => setIsRegistering(!isRegistering)} 
              style={{ background: 'none', border: 'none', color: 'var(--color-text-dim)', fontSize: '12px', fontFamily: 'var(--font-mono)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isRegistering ? 'Already an operator? Authenticate here.' : 'Need access? Register as an operator.'}
            </button>
          </form>

          <div className="divider" style={{ margin: '24px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <button type="button" onClick={handleGoogleSignIn} className="btn" style={{ background: 'var(--color-card-hover)', color: 'var(--color-text)', border: '1px solid var(--color-border)', width: '100%' }}>
              <Fingerprint size={16} />
              SIGN IN WITH GOOGLE
            </button>
            <button type="button" onClick={handleLocalPreview} className="btn btn-ghost" style={{ width: '100%' }}>
              OPEN LOCAL PREVIEW
            </button>
          </div>
        </div>
        
        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center', gap: '32px' }}>
          {['SDG 8: DECENT WORK', 'SDG 16: STRONG INSTITUTIONS'].map(sdg => (
            <span key={sdg} className="badge badge-neutral" style={{ letterSpacing: '0.1em' }}>{sdg}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
