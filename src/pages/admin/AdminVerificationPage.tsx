import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
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
  const [orgs, setOrgs] = useState<PendingOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocUrl, setSelectedDocUrl] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'organizations'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: PendingOrg[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetched.push({
          id: docSnap.id,
          name: data.name || 'Organization',
          type: data.type || 'Manufacturer',
          gstCin: data.gstCin || 'N/A',
          location: data.location || 'India',
          docUrl: data.verificationDocUrl || 'https://storage.google.com/org-docs/certificate.pdf',
          verified: !!data.verified,
          registeredDate: typeof data.createdAt === 'string' ? data.createdAt.split('T')[0] : '2026-09-18',
        });
      });
      setOrgs(fetched);
      setLoading(false);
    }, (err) => {
      console.error('Firestore organizations query error:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleVerification = async (id: string, currentVerifiedStatus: boolean) => {
    try {
      await setDoc(
        doc(db, 'organizations', id),
        {
          verified: !currentVerifiedStatus,
        },
        { merge: true }
      );
    } catch (err) {
      console.error('Failed to toggle verification:', err);
      alert('Could not update organization verification status.');
    }
  };

  const pendingCount = orgs.filter((o) => !o.verified).length;

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
          <p className="font-headline-sm text-2xl font-bold text-primary mt-1">{orgs.length}</p>
        </Card>

        <Card className="border border-outline/10 p-4">
          <span className="font-label-sm text-xs text-outline uppercase font-semibold">Pending Verifications</span>
          <p className="font-headline-sm text-2xl font-bold text-amber-600 mt-1">{pendingCount} Request(s)</p>
        </Card>

        <Card className="border border-outline/10 p-4">
          <span className="font-label-sm text-xs text-outline uppercase font-semibold">Verified Organizations</span>
          <p className="font-headline-sm text-2xl font-bold text-secondary mt-1">{orgs.length - pendingCount}</p>
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

        {loading && <div className="text-xs text-outline p-4 text-center">Loading registered organizations from Firestore...</div>}

        {!loading && orgs.length === 0 && (
          <div className="text-xs text-on-surface-variant p-6 text-center">
            No registered organizations found in Firestore.
          </div>
        )}

        {!loading && orgs.length > 0 && (
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
                      {org.docUrl.startsWith('data:image/') || org.docUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                        <button
                          type="button"
                          onClick={() => setSelectedDocUrl(org.docUrl)}
                          className="text-secondary font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Preview Image</span>
                          <span className="material-symbols-outlined text-[14px]">visibility</span>
                        </button>
                      ) : (
                        <a
                          href={org.docUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-secondary font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <span>View Document</span>
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </a>
                      )}
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
                        onClick={() => toggleVerification(org.id, org.verified)}
                      >
                        {org.verified ? 'Revoke Verification' : 'Verify Organization'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Document Preview Lightbox Modal */}
      {selectedDocUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface border border-outline/20 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-4 relative">
            <div className="flex items-center justify-between border-b border-outline/10 pb-3">
              <h3 className="font-headline-sm text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">verified_user</span>
                <span>Verification Document Preview</span>
              </h3>
              <button
                onClick={() => setSelectedDocUrl(null)}
                className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <div className="max-h-[60vh] overflow-auto flex items-center justify-center bg-surface-container-lowest rounded-xl p-4 border border-outline/10">
              <img
                src={selectedDocUrl}
                alt="Verification Document"
                className="max-w-full max-h-[50vh] object-contain rounded-lg shadow"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-on-surface-variant font-mono">
                {selectedDocUrl.startsWith('data:image/') ? `Zero-Cost WebP (${Math.round(selectedDocUrl.length / 1024)} KB)` : 'External URL'}
              </span>
              <Button variant="outline" size="sm" onClick={() => setSelectedDocUrl(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerificationPage;
