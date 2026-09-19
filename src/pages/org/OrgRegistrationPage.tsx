import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';

export const OrgRegistrationPage: React.FC = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Manufacturer');
  const [gstCin, setGstCin] = useState('');
  const [location, setLocation] = useState('Pune, MH');
  const [docUrl, setDocUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="pt-28 pb-16 max-w-[1440px] mx-auto px-4 flex items-center justify-center min-h-[85vh]">
      <Card className="w-full max-w-xl border border-outline/10 p-space-xl shadow-xl">
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary text-secondary-fixed flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[28px]">corporate_fare</span>
          </div>
          <h1 className="font-headline-sm text-2xl font-bold text-primary">Register Organization</h1>
          <p className="font-body-md text-xs text-on-surface-variant">
            Register your company, NGO, school, or institution for verified resource governance and threshold tracking.
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center text-center gap-4 py-6">
            <Badge variant="warning" icon="hourglass_top">Pending Platform Verification</Badge>
            <h3 className="font-headline-sm text-xl font-bold text-primary">Registration Submitted!</h3>
            <p className="font-body-md text-sm text-on-surface-variant max-w-md">
              Your organization <strong>{name}</strong> (GST/CIN: {gstCin}) has been registered. Platform administrators are reviewing your verification documentation.
            </p>
            <Button variant="primary" onClick={() => navigate('/org/dashboard')} className="mt-2">
              Proceed to Organization Dashboard
            </Button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <Input
              label="Organization Legal Name"
              placeholder="e.g. Bharat Fab Tech Ltd."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              icon="domain"
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-xs font-semibold text-primary">Organization Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20 focus:outline-none focus:border-secondary"
                >
                  <option>Manufacturer</option>
                  <option>Retailer / Distributor</option>
                  <option>NGO / Non-Profit</option>
                  <option>School / Educational Body</option>
                  <option>Hospital / Healthcare</option>
                  <option>Other Institution</option>
                </select>
              </div>

              <Input
                label="GSTIN / CIN Registration #"
                placeholder="e.g. 27AAAAA0000A1Z5 / U28910"
                value={gstCin}
                onChange={(e) => setGstCin(e.target.value)}
                required
                icon="badge"
              />
            </div>

            <Input
              label="Headquarters Location"
              placeholder="e.g. Pune Fabrication Complex, MH"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              icon="location_on"
            />

            <Input
              label="Verification Certificate / Document URL"
              placeholder="https://storage.google.com/org-docs/certificate.pdf"
              value={docUrl}
              onChange={(e) => setDocUrl(e.target.value)}
              icon="link"
            />

            <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full mt-2">
              Submit Organization Registration
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
