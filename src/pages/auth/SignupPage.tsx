import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { UserRole } from '../../types';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [location, setLocation] = useState('Ahmedabad');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await signup(email, password, name, role, location);
      if (role === 'org_admin' || role === 'org_member') {
        navigate('/org/register');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-16 max-w-[1440px] mx-auto px-4 flex items-center justify-center min-h-[85vh]">
      <Card className="w-full max-w-lg border border-outline/10 p-space-xl shadow-xl">
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary text-secondary-fixed flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[28px]">person_add</span>
          </div>
          <h1 className="font-headline-sm text-2xl font-bold text-primary">Create Account</h1>
          <p className="font-body-md text-xs text-on-surface-variant">
            Join CircleLoop to extend resource lifespan, buy/sell, donate, or manage organizational usage.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            placeholder="e.g. Ananya Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            icon="person"
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="name@organization.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon="mail"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon="lock"
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs font-semibold text-primary">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20 focus:outline-none focus:border-secondary"
              >
                <option value="user">Regular User</option>
                <option value="org_member">Organization Member</option>
                <option value="org_admin">Organization Admin</option>
                <option value="platform_admin">Platform Admin</option>
              </select>
            </div>

            <Input
              label="Location (City)"
              placeholder="e.g. Ahmedabad, Pune"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full mt-2">
            Register CircleLoop Account
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </Card>
    </div>
  );
};
