// packages/ui/src/components/ProgressBar.tsx
// Animated progress bar used in student skill trees, learning journeys,
// and parent/teacher report views. Fill animates with easing, not instantly.

import React, { useEffect, useState } from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = true,
  color,
  height = 12,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Animate towards the target value on mount/update for a smooth fill effect.
    const clamped = Math.min(100, Math.max(0, value));
    const raf = requestAnimationFrame(() => setDisplayValue(clamped));
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div className="medhaa-progress">
      {label && (
        <div className="medhaa-progress__header">
          <span className="medhaa-progress__label">{label}</span>
          {showPercentage && (
            <span className="medhaa-progress__pct">{Math.round(displayValue)}%</span>
          )}
        </div>
      )}
      <div className="medhaa-progress__track" style={{ height }}>
        <div
          className="medhaa-progress__fill"
          style={{
            width: `${displayValue}%`,
            background: color || 'var(--medhaa-primary)',
          }}
        />
      </div>
    </div>
  );
};
