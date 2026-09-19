import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  bordered = false,
}) => {
  return (
    <div
      className={clsx(
        'bg-surface-container-lowest rounded-xl p-space-lg shadow-sm transition-all duration-200',
        hoverable && 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
        bordered && 'border border-outline/15',
        className
      )}
    >
      {children}
    </div>
  );
};
