import React from 'react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while processing your request.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-space-xl min-h-[250px] w-full text-center gap-3 bg-error-container/20 rounded-xl border border-error/20">
      <span className="material-symbols-outlined text-error text-[40px]">error_outline</span>
      <h3 className="font-headline-sm text-lg text-primary">{title}</h3>
      <p className="font-body-md text-on-surface-variant max-w-md text-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} icon={<span className="material-symbols-outlined text-[16px]">refresh</span>}>
          Try Again
        </Button>
      )}
    </div>
  );
};
