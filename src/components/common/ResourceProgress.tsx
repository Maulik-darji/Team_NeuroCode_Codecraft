import React from 'react';
import { clsx } from 'clsx';

interface ResourceProgressProps {
  name: string;
  unit: string;
  currentUsage: number;
  monthlyLimit: number;
  icon?: string;
}

export const ResourceProgress: React.FC<ResourceProgressProps> = ({
  name,
  unit,
  currentUsage,
  monthlyLimit,
  icon = 'bolt',
}) => {
  const percentage = Math.min(100, Math.round((currentUsage / Math.max(1, monthlyLimit)) * 1000) / 10);
  const remaining = Math.max(0, monthlyLimit - currentUsage);
  const isHighRisk = percentage >= 80;

  return (
    <div className="bg-surface-container-lowest p-3.5 rounded-lg flex flex-col gap-2 border border-outline/10">
      <div className="flex items-center justify-between font-label-sm text-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[20px]">{icon}</span>
          <span className="font-bold text-primary">{name}</span>
        </div>
        <span className="text-on-surface-variant text-xs">
          Consumed: <strong className="text-primary font-mono">{currentUsage.toLocaleString()} {unit}</strong> / {monthlyLimit.toLocaleString()} {unit}
        </span>
      </div>

      <div className="relative w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500',
            isHighRisk ? 'bg-error' : 'bg-secondary'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between font-label-sm text-[11px] text-outline">
        <span>{percentage}% Consumed</span>
        <span className={clsx('font-semibold', isHighRisk ? 'text-error' : 'text-secondary')}>
          {remaining.toLocaleString()} {unit} remaining ({isHighRisk ? 'Threshold Alert' : `${(100 - percentage).toFixed(1)}%`})
        </span>
      </div>
    </div>
  );
};
