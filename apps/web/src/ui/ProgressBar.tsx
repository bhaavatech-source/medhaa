import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  value: number;
  label: string;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  color = '#6366f1',
}) => {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
      <div
        style={{
          background: '#e5e7eb',
          borderRadius: 999,
          overflow: 'hidden',
          height: 8,
        }}
      >
        <div
          style={{
            width: `${value}%`,
            background: color,
            height: '100%',
          }}
        />
      </div>
    </div>
  );
};
