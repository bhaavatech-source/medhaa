// src/ui/MedhaaLogo.tsx
import React from 'react';
import fullLogo from '/images/logo/medhaa-m2-full.png';

type MedhaaLogoProps = {
  variant?: 'full' | 'mark';
  size?: number;
};

export function MedhaaLogo({ variant = 'full', size = 40 }: MedhaaLogoProps) {
  if (variant === 'mark') {
    return (
      <span
        className="brand-mark"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        M
      </span>
    );
  }

  return (
    <img
      src={fullLogo}
      alt="Medhaa"
      style={{ height: size, display: 'block' }}
    />
  );
}
