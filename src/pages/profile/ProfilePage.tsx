import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';

export const ProfilePage: React.FC = () => {
  const { userProfile } = useAuth();
  const [name, setName] = useState(userProfile?.displayName || 'Ananya Sharma');
  const [phone, setPhone] = useState(userProfile?.phone || '+91 98765 43210');
  const [location, setLocation] = useState(userProfile?.location || 'Ahmedabad, GJ');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="pt-24 pb-16 max-w-[1440px] mx-auto px-4 flex items-center justify-center">
      <Card className="w-full max-w-lg border border-outline/10 p-space-xl shadow-xl">
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary text-secondary-fixed flex items-center justify-center font-bold text-xl">
            {name.charAt(0)}
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-headline-sm text-2xl font-bold text-primary">{name}</h1>
            <Badge variant="secondary" icon="verified">Verified</Badge>
          </div>
          <span className="font-label-sm text-xs text-on-surface-variant font-mono">{userProfile?.email || 'user@circleloop.org'}</span>
        </div>

        {saved && (
          <div className="mb-4 p-3 rounded-lg bg-secondary-fixed/40 text-on-secondary-fixed-variant text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            label="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            icon="person"
          />

          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            icon="call"
          />

          <Input
            label="City Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            icon="location_on"
          />

          <div className="bg-surface-container-low p-3 rounded-lg text-xs font-label-sm border border-outline/10 flex justify-between">
            <span className="text-outline">Assigned Account Role:</span>
            <strong className="text-primary font-bold uppercase">{userProfile?.role || 'user'}</strong>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
            Save Profile Changes
          </Button>
        </form>
      </Card>
    </div>
  );
};
