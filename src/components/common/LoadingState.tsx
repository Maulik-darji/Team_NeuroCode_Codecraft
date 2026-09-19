import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading CircleLoop platform data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-space-xl min-h-[250px] w-full gap-3">
      <span className="material-symbols-outlined animate-spin text-secondary text-[36px]">
        autorenew
      </span>
      <p className="font-body-md text-on-surface-variant text-sm font-medium">{message}</p>
    </div>
  );
};
