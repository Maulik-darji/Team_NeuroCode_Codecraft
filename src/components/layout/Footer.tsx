import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-on-primary py-6 mt-16 border-t border-primary-container">
      <div className="max-w-[1440px] mx-auto px-4 md:px-margin flex items-center justify-center font-mono text-xs text-on-primary-container">
        <p>© 2026 CircleLoop OS</p>
      </div>
    </footer>
  );
};
