// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Displays text with an embedded glitch capability to provide dramatic aesthetic visual effects natively. */
import React from 'react';

export default function GlitchText({ text, glowColor = 'var(--color-threat)' }) {
  return (
    <span 
      className="glitch" 
      data-text={text} 
      style={{ 
        fontFamily: 'var(--font-display)', 
        fontWeight: 900, 
        letterSpacing: '0.05em',
        textShadow: `0 0 10px ${glowColor}`
      }}
    >
      {text}
    </span>
  );
}
