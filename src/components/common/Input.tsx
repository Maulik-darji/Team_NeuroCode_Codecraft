import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="font-label-sm text-xs font-semibold text-primary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full py-2.5 px-3.5 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline text-body-sm font-body-sm border border-outline/20 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all',
              icon && 'pl-10',
              error && 'border-error focus:ring-error/20',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-error font-body-sm mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
