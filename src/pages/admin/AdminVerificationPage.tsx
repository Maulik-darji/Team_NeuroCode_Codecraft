import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

interface PendingOrg {
  id: string;
  name: string;
  type: string;
  gstCin: string;
  location: string;
  docUrl: string;
  verified: boolean;
  registeredDate: string;
}

export const AdminVerificationPage: React.FC = () => {
  const [orgs, setOrgs] = useState<PendingOrg[]>([
    {
      id: 'org-101',
      name: 'Apex Innovation Lab',
      type: 'School / Institution',
      gstCin: 'U80902KA2018PTC1',
      location: 'Bengaluru, KA',
      docUrl: 'https://storage.google.com/org-docs/apex_lab.pdf',
      verified: false,
      registeredDate: '2026-09-18',
    },
    {
      id: 'org-102',
      name: 'GreenField Eco NGO',
      type: 'NGO / Non-Profit',
      gstCin: 'AAATG8812N1Z9',
      location: 'Ahmedabad, GJ',
      docUrl: 'https://storage.google.com/org-docs/greenfield_ngo.pdf',
      verified: true,
      registeredDate: '2026-09-15',
    },
    {
      id: 'org-103',
      name: 'TechCorp Hub 4',
      type: 'Manufacturer',
      gstCin: '27AAACT1234F1Z0',
      location: 'Pune, MH',
      docUrl: 'https://storage.google.com/org-docs/techcorp_hub.pdf',
      verified: true,
      registeredDate: '2026-09-10',
    },
  ]);

  const toggleVerification = (id: string) => {
    setOrgs((prev) =>
      prev.map((o) => (o.id === id ? { ...o, verified: !o.verified } : o))
    );
  };

  return (
    <div className="pt-24 pb-16 max-w-[1440px] mx-auto px-4 md:px-margin">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display-hero text-3xl font-bold text-primary">
              Platform Admin Dashboard
            </h1>
            <Badge variant="primary" icon="admin_panel_settings">Platform Admin</Badge>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Review organization verification requests, manage custom claims, and monitor platform health.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border border-outline/10 p-4">
          <span className="font-label-sm text-xs text-outline uppercase font-semibold">Registered Organizations</span>
          <p className="font-headline-sm text-2xl font-bold text-primary mt-1">128</p>
        </Card>

        <Card className="border border-outline/10 p-4">
          <span className="font-label-sm text-xs text-outline uppercase font-semibold">Pending Verifications</span>
          <p className="font-headline-sm text-2xl font-bold text-amber-600 mt-1">1 Request</p>
        </Card>

        <Card className="border border-outline/10 p-4">
          <span className="font-label-sm text-xs text-outline uppercase font-semibold">Live Listings Verified</span>
          <p className="font-headline-sm text-2xl font-bold text-secondary mt-1">1,420</p>
        </Card>

        <Card className="border border-outline/10 p-4">
          <span className="font-label-sm text-xs text-outline uppercase font-semibold">Total Landfill Diverted</span>
          <p className="font-headline-sm text-2xl font-bold text-primary mt-1">428.4 MT</p>
        </Card>
      </div>

      {/* Organization Verification Table */}
      <Card className="border border-outline/10 p-space-lg">
        <h3 className="font-headline-sm text-lg font-bold text-primary mb-4">
          Organization Verification Management
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-body-sm text-xs">
            <thead>
              <tr className="border-b border-outline/15 text-outline font-label-sm uppercase">
                <th className="py-3 px-3">Organization Name</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">GST / CIN</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Doc Link</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orgs.map((org) => (
                <tr key={org.id} className="border-b border-outline/10 hover:bg-surface-container-low/50">
                  <td className="py-3 px-3 font-bold text-primary">{org.name}</td>
                  <td className="py-3 px-3 text-on-surface-variant">{org.type}</td>
                  <td className="py-3 px-3 font-mono">{org.gstCin}</td>
                  <td className="py-3 px-3 text-on-surface-variant">{org.location}</td>
                  <td className="py-3 px-3">
                    <a
                      href={org.docUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-secondary font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <span>View PDF</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </td>
                  <td className="py-3 px-3">
                    {org.verified ? (
                      <Badge variant="secondary" icon="check_circle">Verified</Badge>
                    ) : (
                      <Badge variant="warning" icon="hourglass_top">Pending</Badge>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      variant={org.verified ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => toggleVerification(org.id)}
                    >
                      {org.verified ? 'Revoke Verification' : 'Verify Organization'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
