import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleProtectedRoute } from './components/RoleProtectedRoute';

// Public pages
import { LandingPage } from './pages/public/LandingPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { OrganizationsPage } from './pages/public/OrganizationsPage';
import { RepairRecyclePage } from './pages/public/RepairRecyclePage';

// Marketplace Page
import { MarketplacePage } from './pages/marketplace/MarketplacePage';

// Sourcing Requirements & Messaging
import { RequirementsPage } from './pages/requirements/RequirementsPage';
import { ConversationsPage } from './pages/conversations/ConversationsPage';
import { ProfilePage } from './pages/profile/ProfilePage';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

// Protected Application pages
import { UserDashboardPage } from './pages/dashboard/UserDashboardPage';
import { OrgRegistrationPage } from './pages/org/OrgRegistrationPage';
import { OrgDashboardPage } from './pages/org/OrgDashboardPage';
import { AdminVerificationPage } from './pages/admin/AdminVerificationPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/organizations" element={<OrganizationsPage />} />
              <Route path="/repair-recycle" element={<RepairRecyclePage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected User Dashboard & Profile */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Sourcing & Messaging Routes */}
              <Route
                path="/requirements"
                element={
                  <ProtectedRoute>
                    <RequirementsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/conversations"
                element={
                  <ProtectedRoute>
                    <ConversationsPage />
                  </ProtectedRoute>
                }
              />

              {/* Organization Registration */}
              <Route
                path="/org/register"
                element={
                  <ProtectedRoute>
                    <OrgRegistrationPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Organization Dashboard (RBAC: org_admin, org_member, platform_admin) */}
              <Route
                path="/org/dashboard"
                element={
                  <RoleProtectedRoute allowedRoles={['org_admin', 'org_member', 'platform_admin']}>
                    <OrgDashboardPage />
                  </RoleProtectedRoute>
                }
              />

              {/* Protected Platform Admin Dashboard (RBAC: platform_admin) */}
              <Route
                path="/admin/verification"
                element={
                  <RoleProtectedRoute allowedRoles={['platform_admin']}>
                    <AdminVerificationPage />
                  </RoleProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
