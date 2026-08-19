// packages/ui/src/components/Button.tsx
// Reusable button used across all four role UIs. Visual weight and
// animation intensity adapt to role via CSS variables set by ThemeProvider.

import React from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  onClick,
  ...rest
}) => {
  // Ripple effect on click — subtle tactile feedback, not flashy.
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - diameter / 2}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - diameter / 2}px`;
    circle.classList.add('medhaa-ripple');
    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
    onClick?.(e);
  };

  return (
    <button
      className={`medhaa-btn medhaa-btn--${variant} medhaa-btn--${size} ${
        fullWidth ? 'medhaa-btn--full' : ''
      } ${className}`}
      disabled={disabled || loading}
      onClick={handleClick}
      aria-busy={loading}
      {...rest}
    >
      {loading ? <span className="medhaa-btn__spinner" aria-hidden="true" /> : children}
    </button>
  );
};
