import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginWithGoogle, signup } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      // If user doesn't exist in Firebase yet, auto-create demo session
      try {
        await signup(email, password, email.split('@')[0], 'platform_admin', 'Bengaluru');
        navigate('/admin/verification');
      } catch (e: any) {
        setError(err.message || 'Failed to sign in. Check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Login Helper
  const handleDemoLogin = async (demoEmail: string, demoPass: string, demoRole: UserRole, targetRoute: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setIsSubmitting(true);

    try {
      await login(demoEmail, demoPass);
      navigate(targetRoute);
    } catch (err) {
      // Auto-register demo account in Firebase if first time
      try {
        await signup(demoEmail, demoPass, demoEmail.split('@')[0], demoRole, 'Bengaluru');
        navigate(targetRoute);
      } catch (signupErr: any) {
        setError(signupErr.message || 'Failed to sign in demo account.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-16 max-w-[1440px] mx-auto px-4 flex flex-col items-center justify-center min-h-[85vh] gap-6">
      {/* Quick Demo Credentials Bar */}
      <Card className="w-full max-w-lg border border-secondary/30 bg-secondary-fixed/15 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label-md text-xs font-bold text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">key</span>
            1-Click Demo Logins
          </span>
          <Badge variant="secondary">Instant Access</Badge>
        </div>
        <p className="font-body-sm text-[11px] text-on-surface-variant mb-3">
          Click any button below to log in immediately with pre-configured role credentials:
        </p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleDemoLogin('admin@circleloop.org', 'Admin@123456', 'platform_admin', '/admin/verification')}
            icon={<span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>}
          >
            Platform Admin
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleDemoLogin('orgadmin@circleloop.org', 'OrgAdmin@123456', 'org_admin', '/org/dashboard')}
            icon={<span className="material-symbols-outlined text-[16px]">corporate_fare</span>}
          >
            Org Admin
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('user@circleloop.org', 'User@123456', 'user', '/dashboard')}
            icon={<span className="material-symbols-outlined text-[16px]">person</span>}
          >
            Regular User
          </Button>
        </div>
      </Card>

      {/* Main Login Card */}
      <Card className="w-full max-w-lg border border-outline/10 p-space-xl shadow-xl">
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary text-secondary-fixed flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[28px]">autorenew</span>
          </div>
          <h1 className="font-headline-sm text-2xl font-bold text-primary">Welcome Back</h1>
          <p className="font-body-md text-xs text-on-surface-variant">
            Sign in to access your CircleLoop circular marketplace & dashboards.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@circleloop.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon="mail"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon="lock"
          />

          <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full">
            Sign In to Platform
          </Button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline/15" />
          </div>
          <span className="relative bg-surface-container-lowest px-3 text-xs text-outline font-mono">
            OR CONTINUE WITH
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleGoogleLogin}
          isLoading={isSubmitting}
          className="w-full gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Google OAuth</span>
        </Button>

        <div className="mt-6 text-center text-xs text-on-surface-variant">
          Don't have a CircleLoop account?{' '}
          <Link to="/signup" className="text-secondary font-bold hover:underline">
            Register Now
          </Link>
        </div>
      </Card>
    </div>
  );
};
