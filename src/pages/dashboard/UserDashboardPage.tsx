import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const UserDashboardPage: React.FC = () => {
  const { userProfile, logout } = useAuth();

  return (
    <div className="pt-24 pb-16 max-w-[1440px] mx-auto px-4 md:px-margin">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display-hero text-3xl font-bold text-primary">
              Welcome, {userProfile?.displayName || 'User'}
            </h1>
            <Badge variant="secondary" icon="person">{userProfile?.role || 'user'}</Badge>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Location: {userProfile?.location || 'Ahmedabad, GJ'} • {userProfile?.email}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {userProfile?.role === 'org_admin' && (
            <Link to="/org/dashboard">
              <Button variant="secondary" icon={<span className="material-symbols-outlined text-[18px]">corporate_fare</span>}>
                Organization Dashboard
              </Button>
            </Link>
          )}
          {userProfile?.role === 'platform_admin' && (
            <Link to="/admin/verification">
              <Button variant="primary" icon={<span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>}>
                Platform Admin Console
              </Button>
            </Link>
          )}
          <Button variant="outline" onClick={logout} icon={<span className="material-symbols-outlined text-[18px]">logout</span>}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Grid of quick user modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border border-outline/10 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-secondary text-[28px]">storefront</span>
              <Badge variant="accent">Marketplace</Badge>
            </div>
            <h3 className="font-headline-sm text-lg font-bold text-primary">My Active Listings</h3>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Manage your posted items, price updates, and secondary asset transfers.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-outline/10 flex items-center justify-between">
            <span className="text-xs text-outline font-mono">0 Active Listings</span>
            <Link to="/marketplace" className="text-xs text-secondary font-bold hover:underline">
              Create Listing →
            </Link>
          </div>
        </Card>

        <Card className="border border-outline/10 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-secondary text-[28px]">find_in_page</span>
              <Badge variant="neutral">Requirements</Badge>
            </div>
            <h3 className="font-headline-sm text-lg font-bold text-primary">My Requirements</h3>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Post items you need and let CircleLoop automatically pair relevant listings.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-outline/10 flex items-center justify-between">
            <span className="text-xs text-outline font-mono">1 Matched Query</span>
            <Link to="/marketplace" className="text-xs text-secondary font-bold hover:underline">
              Post Requirement →
            </Link>
          </div>
        </Card>

        <Card className="border border-outline/10 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-secondary text-[28px]">chat</span>
              <Badge variant="secondary">Conversations</Badge>
            </div>
            <h3 className="font-headline-sm text-lg font-bold text-primary">Buyer & AI Chats</h3>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Review seller replies and AI Assistant auto-handled specification Q&A.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-outline/10 flex items-center justify-between">
            <span className="text-xs text-outline font-mono">0 Pending Chats</span>
            <Link to="/marketplace" className="text-xs text-secondary font-bold hover:underline">
              View Conversations →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
