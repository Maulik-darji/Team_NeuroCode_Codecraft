import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-label-md transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-container shadow-sm',
    secondary: 'bg-secondary text-on-secondary hover:bg-on-secondary-container shadow-sm',
    outline: 'border border-outline/30 text-primary hover:bg-surface-container-low',
    ghost: 'text-primary hover:bg-secondary-container/20',
    danger: 'bg-error text-on-error hover:bg-on-error-container',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
      ) : icon ? (
        <span className="flex items-center">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
