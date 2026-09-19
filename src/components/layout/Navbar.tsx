import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Organizations', path: '/organizations' },
    { name: 'Repair & Recycle', path: '/repair-recycle' },
    { name: 'AI Impact', path: '/#ai-impact' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(27,67,50,0.06)] border-b border-outline/10">
      <div className="h-20 max-w-[1440px] mx-auto px-4 md:px-margin flex items-center justify-between gap-space-lg">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-space-sm group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-secondary-fixed shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">autorenew</span>
          </div>
          <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
            CircleLoop
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-space-lg">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`transition-colors text-sm font-medium ${
                  isActive
                    ? 'text-primary font-semibold border-b-2 border-secondary pb-0.5'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-space-sm">
          <Link to="/login" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/org/register" className="hidden xl:inline-flex">
            <Button variant="outline" size="sm" icon={<span className="material-symbols-outlined text-[18px]">corporate_fare</span>}>
              For Organizations
            </Button>
          </Link>
          <Link to="/marketplace">
            <Button variant="primary" size="sm" icon={<span className="material-symbols-outlined text-[18px]">east</span>}>
              Explore Marketplace
            </Button>
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-primary hover:bg-surface-container"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-b border-outline/10 px-4 py-4 flex flex-col gap-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-primary font-medium text-base border-b border-outline/5"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link to="/org/register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full">
                For Organizations
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
