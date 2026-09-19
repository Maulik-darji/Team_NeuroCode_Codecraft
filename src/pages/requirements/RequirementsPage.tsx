import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Requirement, ListingCategory } from '../../types';

export const RequirementsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ListingCategory>('Electronics');
  const [maxBudget, setMaxBudget] = useState('70000');
  const [location, setLocation] = useState('Bengaluru, KA');
  const [description, setDescription] = useState('');

  const [requirements, setRequirements] = useState<Requirement[]>([
    {
      id: 'req-1',
      title: 'Need 5 Used Enterprise Server Units',
      description: 'Looking for decommissioned Dell/HP servers in working condition for university lab research.',
      category: 'Electronics',
      maxBudget: 75000,
      location: 'Bengaluru, KA',
      postedBy: 'user-univ',
      postedByName: 'Apex University Lab',
      matchedListings: ['l-101'],
      status: 'Open',
      createdAt: '2026-09-18',
    },
    {
      id: 'req-2',
      title: 'Need 15 Wooden Study Desks for NGO',
      description: 'Require sturdy wooden benches or chairs for primary education learning center.',
      category: 'Furniture',
      maxBudget: 0,
      location: 'Ahmedabad, GJ',
      postedBy: 'user-ngo',
      postedByName: 'Shanti Education Trust',
      matchedListings: ['l-102'],
      status: 'Open',
      createdAt: '2026-09-17',
    },
  ]);

  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: Requirement = {
      id: `req-${Date.now()}`,
      title,
      description,
      category,
      maxBudget: parseFloat(maxBudget) || 0,
      location,
      postedBy: 'user-current',
      postedByName: 'Current User',
      matchedListings: ['l-101'], // Deterministic match trigger
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setRequirements([newReq, ...requirements]);
    setShowModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="pt-24 pb-16 max-w-[1440px] mx-auto px-4 md:px-margin">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display-hero text-3xl font-bold text-primary">
              Resource Requirements
            </h1>
            <Badge variant="primary" icon="find_in_page">Item Sourcing</Badge>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Post what you need. CircleLoop automatically pairs your query with matching secondary listings.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          icon={<span className="material-symbols-outlined text-[18px]">post_add</span>}
        >
          Post New Requirement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requirements.map((req) => (
          <Card key={req.id} className="border border-outline/10 flex flex-col justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{req.category}</Badge>
                <Badge variant="warning" icon="hourglass_top">{req.status}</Badge>
              </div>

              <h3 className="font-headline-sm text-lg font-bold text-primary">{req.title}</h3>
              <p className="font-body-md text-xs text-on-surface-variant">{req.description}</p>

              <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-2.5 rounded-lg text-xs font-label-sm border border-outline/10">
                <div>
                  <span className="text-outline">Max Budget:</span>{' '}
                  <strong className="text-primary">{req.maxBudget === 0 ? 'Donation Grant (€0 / ₹0)' : `₹${req.maxBudget?.toLocaleString()}`}</strong>
                </div>
                <div>
                  <span className="text-outline">Location:</span> <strong className="text-primary">{req.location}</strong>
                </div>
              </div>

              {/* Matched Listings Card */}
              <div className="p-3 rounded-lg bg-secondary-fixed/20 border border-secondary/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">task_alt</span>
                  <span className="text-xs text-primary font-bold">
                    {req.matchedListings.length} Matching Marketplace Listing Found
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="text-secondary font-bold">
                  View Match →
                </Button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-outline/10 flex items-center justify-between text-xs text-on-surface-variant">
              <span>Posted by: <strong>{req.postedByName}</strong></span>
              <span>{req.createdAt}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-lg border border-outline/10 p-6 shadow-2xl bg-surface-container-lowest">
            <div className="flex items-center justify-between pb-3 border-b border-outline/10 mb-4">
              <h3 className="font-headline-sm text-xl font-bold text-primary">Post Sourcing Requirement</h3>
              <button onClick={() => setShowModal(false)} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateRequirement} className="flex flex-col gap-4">
              <Input
                label="Requirement Title"
                placeholder="e.g. Need 5 used office chairs in Ahmedabad"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-xs font-semibold text-primary">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ListingCategory)}
                    className="py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Machinery">Machinery</option>
                    <option value="Materials">Materials</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <Input
                  label="Max Budget (₹)"
                  placeholder="0 for donation request"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Location (City)"
                placeholder="e.g. Bengaluru, KA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-xs font-semibold text-primary">Detailed Description</label>
                <textarea
                  rows={3}
                  placeholder="Specify required condition, quantity, and urgency..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20"
                />
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Post Requirement</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
