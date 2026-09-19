import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inventory_2',
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-space-xl min-h-[280px] w-full text-center gap-3 bg-surface-container-low/50 rounded-xl border border-outline/10">
      <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
        <span className="material-symbols-outlined text-[30px]">{icon}</span>
      </div>
      <h3 className="font-headline-sm text-lg text-primary">{title}</h3>
      <p className="font-body-md text-on-surface-variant max-w-sm text-sm">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};
