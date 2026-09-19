import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'System Ingress', path: '/splash' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Item Requests', path: '/requirements' },
    { name: 'Organizations', path: '/organizations' },
    { name: 'Repair & Recycle', path: '/repair-recycle' },
    { name: 'AI Impact', path: '/#ai-impact' },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setProfileMenuOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Guest User';
  const displayEmail = user?.email || 'Not signed in';

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

        {/* User Profile CTA Menu */}
        <div className="flex items-center gap-space-sm relative" ref={dropdownRef}>
          {/* User Profile Symbol Button */}
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 p-1.5 px-3 rounded-full border border-outline/20 hover:border-secondary bg-surface-container-lowest hover:bg-surface-container transition-all shadow-xs"
            aria-label="User Profile Menu"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="w-7 h-7 rounded-full object-cover border border-secondary"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
              </div>
            )}
            <span className="text-xs font-bold text-primary hidden sm:inline-block max-w-[120px] truncate">
              {displayName}
            </span>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              {profileMenuOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
            </span>
          </button>

          {/* User Profile Dropdown Menu */}
          {profileMenuOpen && (
            <div className="absolute right-0 top-12 w-64 bg-surface border border-outline/15 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* User Info Header */}
              <div className="px-3 py-2 border-b border-outline/10 mb-1">
                <p className="text-xs font-bold text-primary truncate">{displayName}</p>
                <p className="text-[11px] text-on-surface-variant truncate">{displayEmail}</p>
                {userProfile?.role && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-mono text-[10px] font-bold">
                    {userProfile.role.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Options inside User Profile */}
              <div className="flex flex-col gap-0.5">
                <Link
                  to="/marketplace"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-primary hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">storefront</span>
                  <span>Explore Marketplace</span>
                </Link>

                <Link
                  to="/org/register"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-primary hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">corporate_fare</span>
                  <span>For Organizations</span>
                </Link>

                <Link
                  to="/requirements"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-primary hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">campaign</span>
                  <span>Item Requests</span>
                </Link>

                {user && (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-primary hover:bg-surface-container-low transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-secondary">dashboard</span>
                      <span>My Dashboard</span>
                    </Link>

                    <Link
                      to="/conversations"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-primary hover:bg-surface-container-low transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-secondary">chat</span>
                      <span>Messages & Offers</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Action Footer */}
              <div className="border-t border-outline/10 mt-1 pt-1">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-error hover:bg-error/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-secondary hover:bg-secondary/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">login</span>
                    <span>Sign In / Register</span>
                  </Link>
                )}
              </div>
            </div>
          )}

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
            {!user && (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
            <Link to="/org/register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full">
                For Organizations
              </Button>
            </Link>
            <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">
                Explore Marketplace
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
