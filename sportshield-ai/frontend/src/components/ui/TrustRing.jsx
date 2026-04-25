// SportShield AI | Google Solution Challenge 2026 | First Prize Target
/** WHY: Highly engaging visual radar indicator for scanning logic, relies natively on CountUp and CSS. */
import React, { useEffect, useState } from 'react';
import { useCountUp } from '../../hooks/useCountUp';

export default function TrustRing({ score = 0, size = 180, strokeWidth = 14 }) {
  const animatedScore = useCountUp(score, 1800);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const fraction = score / 100;
    setOffset(circumference - fraction * circumference);
  }, [score, circumference]);

  let color = 'var(--color-threat)';
  if (score >= 90) color = 'var(--color-safe)';
  else if (score >= 70) color = 'var(--color-info)';
  else if (score >= 50) color = 'var(--color-warn)';

  return (
    <div className="trust-ring-container scale-reveal">
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} className="trust-ring-svg" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={radius} stroke="var(--color-deep)" strokeWidth={strokeWidth} fill="none" />
          <circle 
            cx={size/2} cy={size/2} r={radius} 
            stroke={color} strokeWidth={strokeWidth} fill="none"
            strokeLinecap="round"
            style={{ 
              strokeDasharray: circumference, strokeDashoffset: offset,
              transition: 'stroke-dashoffset 1.8s ease-in-out',
              filter: `drop-shadow(0 0 8px ${color}88)`
            }} 
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: `${size/3.5}px`, fontWeight: 900, color: 'var(--color-text)', lineHeight: 1 }}>
            {animatedScore}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--color-text-dim)', textTransform: 'uppercase', marginTop: '4px' }}>
            Trust Score
          </span>
        </div>
      </div>
    </div>
  );
}
