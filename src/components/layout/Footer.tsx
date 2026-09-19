import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-on-primary pt-space-xl pb-space-lg mt-space-xl border-t border-primary-container">
      <div className="max-w-[1440px] mx-auto px-4 md:px-margin grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl">
        {/* Brand Col */}
        <div className="lg:col-span-2 flex flex-col gap-space-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary-fixed text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">autorenew</span>
            </div>
            <span className="font-headline-sm text-xl text-on-primary font-bold">CircleLoop</span>
          </div>
          <p className="font-body-md text-on-primary-container text-sm max-w-sm">
            CircleLoop is a full-stack sustainability platform extending the useful lifespan of industrial, office, and commercial resources before waste.
          </p>
          <div className="flex items-center gap-2 text-xs text-on-primary-container font-mono pt-2">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
            <span>Zero-Landfill Protocol Compliant • ISO 14044</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h4 className="font-label-md text-sm text-secondary-fixed uppercase tracking-wider font-bold">Platform</h4>
          <Link to="/marketplace" className="text-sm text-on-primary-container hover:text-on-primary transition-colors">Marketplace</Link>
          <Link to="/how-it-works" className="text-sm text-on-primary-container hover:text-on-primary transition-colors">How It Works</Link>
          <Link to="/repair-recycle" className="text-sm text-on-primary-container hover:text-on-primary transition-colors">Repair & Recycle</Link>
          <Link to="/organizations" className="text-sm text-on-primary-container hover:text-on-primary transition-colors">For Organizations</Link>
        </div>

        {/* User Solutions */}
        <div className="flex flex-col gap-2">
          <h4 className="font-label-md text-sm text-secondary-fixed uppercase tracking-wider font-bold">Solutions</h4>
          <Link to="/marketplace?category=Electronics" className="text-sm text-on-primary-container hover:text-on-primary transition-colors">Enterprise E-Waste</Link>
          <Link to="/marketplace?category=Machinery" className="text-sm text-on-primary-container hover:text-on-primary transition-colors">Machinery Transfer</Link>
          <Link to="/marketplace?price=0" className="text-sm text-on-primary-container hover:text-on-primary transition-colors">Donation Grants</Link>
          <Link to="/org/register" className="text-sm text-on-primary-container hover:text-on-primary transition-colors">Resource Governance</Link>
        </div>

        {/* Governance & Contact */}
        <div className="flex flex-col gap-2">
          <h4 className="font-label-md text-sm text-secondary-fixed uppercase tracking-wider font-bold">Governance</h4>
          <span className="text-sm text-on-primary-container">GST / CIN Verification</span>
          <span className="text-sm text-on-primary-container">Role-Based Access Control</span>
          <span className="text-sm text-on-primary-container">Chain-of-Custody Manifest</span>
          <Link to="/login" className="text-sm text-secondary-fixed font-semibold hover:underline">Platform Admin Access</Link>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-margin mt-space-lg pt-space-md border-t border-primary-container/60 flex flex-col md:flex-row items-center justify-between text-xs text-on-primary-container gap-2">
        <p>© 2026 CircleLoop Circular Economy Platform. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="hover:text-on-primary cursor-pointer">Privacy Policy</span>
          <span className="hover:text-on-primary cursor-pointer">Terms of Governance</span>
          <span className="hover:text-on-primary cursor-pointer">ESG Audit Standard</span>
        </div>
      </div>
    </footer>
  );
};
