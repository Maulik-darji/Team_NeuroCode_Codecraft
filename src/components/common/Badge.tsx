import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'free' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  icon?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  icon,
  className,
}) => {
  const styles = {
    primary: 'bg-primary-container text-on-primary-container font-semibold',
    secondary: 'bg-secondary-container text-on-secondary-container font-semibold',
    accent: 'bg-secondary-fixed text-on-secondary-fixed font-bold',
    free: 'bg-secondary-fixed text-on-secondary-fixed font-bold',
    warning: 'bg-amber-100 text-amber-900 font-semibold',
    error: 'bg-error-container text-on-error-container font-semibold',
    neutral: 'bg-surface-container-high text-primary font-medium',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-label-sm uppercase tracking-wide',
        styles[variant],
        sizes[size],
        className
      )}
    >
      {icon && <span className="material-symbols-outlined text-[13px]">{icon}</span>}
      {children}
    </span>
  );
};
