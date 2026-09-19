import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';

export const RepairRecyclePage: React.FC = () => {
  const { user } = useAuth();

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [condition, setCondition] = useState('Fair');
  const [location, setLocation] = useState('Bengaluru');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !location.trim()) {
      alert('Please fill in Item Name and Location.');
      return;
    }

    setIsSubmitting(true);

    try {
      const requestId = `rec_${Date.now()}`;
      const requestData = {
        id: requestId,
        userId: user ? user.uid : 'user-guest',
        itemName: itemName.trim(),
        itemDescription: description.trim(),
        category,
        condition,
        location: location.trim(),
        status: 'Processed',
        createdAt: new Date().toISOString(),
      };

      if (user) {
        await setDoc(doc(db, 'recycleRequests', requestId), requestData);
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Failed to submit recycling request:', err);
      alert('Could not save request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const repairSearchTerm = `${category} Repair in ${location}`;
  const recycleSearchTerm = `Authorised ${category} E-Waste Recycler in ${location}`;

  return (
    <div className="pt-24 pb-16 max-w-[1440px] mx-auto px-4 md:px-margin">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <Badge variant="secondary" icon="build">Asset Life Extension</Badge>
        <h1 className="font-display-hero text-4xl font-bold text-primary mt-3 mb-3">
          Repair & Recycling Assistant
        </h1>
        <p className="font-body-lg text-on-surface-variant text-base">
          Submit an item you no longer use. Our AI analyzes its specifications and recommends general service options (Repair, Recycle, Donate, or Sell) with automated local map actions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
        {/* Form Column */}
        <Card className="lg:col-span-6 border border-outline/10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h3 className="font-headline-sm text-lg font-bold text-primary pb-2 border-b border-outline/10">
              Submit Item Details
            </h3>

            <Input
              label="Item Name *"
              placeholder="e.g. Industrial Servo Motor, HP LaserJet Printer"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-xs font-semibold text-primary">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20 focus:outline-none focus:border-secondary"
                >
                  <option>Electronics</option>
                  <option>Furniture</option>
                  <option>Machinery</option>
                  <option>Materials</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-xs font-semibold text-primary">Condition *</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20 focus:outline-none focus:border-secondary"
                >
                  <option>New</option>
                  <option>Good</option>
                  <option>Fair</option>
                  <option>For Parts</option>
                </select>
              </div>
            </div>

            <Input
              label="Location (City) *"
              placeholder="e.g. Bengaluru, Pune, Ahmedabad"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-xs font-semibold text-primary">Item Description & Notes</label>
              <textarea
                rows={3}
                placeholder="Describe current functionality, defect, or specs..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline text-body-sm font-body-sm border border-outline/20 focus:outline-none focus:border-secondary"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} icon={<span className="material-symbols-outlined text-[20px]">psychology</span>}>
              Get AI Recommendations
            </Button>
          </form>
        </Card>

        {/* AI Recommendations Column */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <h3 className="font-headline-sm text-lg font-bold text-primary">
            {submitted ? 'AI Recommended Pathways' : 'Preview Recommendations'}
          </h3>

          <Card className="border border-outline/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" icon="build">Recommended: Repair</Badge>
              <span className="text-xs text-secondary font-bold font-mono">High Lifespan Extension</span>
            </div>
            <h4 className="font-headline-sm text-base font-bold text-primary">
              Authorised Component Service & Refurbishment
            </h4>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Field inspection and component replacement for <strong>{itemName || 'your item'}</strong> in <strong>{location}</strong> extends useful service life by ~2-3 years while saving ~70% cost over buying new.
            </p>
            <div className="pt-2 border-t border-outline/10 flex items-center justify-between">
              <span className="text-xs text-outline font-mono truncate max-w-[240px]">Search: "{repairSearchTerm}"</span>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(repairSearchTerm)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline"
              >
                <span>Find on Map</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </Card>

          <Card className="border border-outline/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Badge variant="neutral" icon="recycling">Recycle Alternative</Badge>
              <span className="text-xs text-on-surface-variant font-mono">End-of-Life Handover</span>
            </div>
            <h4 className="font-headline-sm text-base font-bold text-primary">
              Authorised ISO-Certified Recycler
            </h4>
            <p className="font-body-sm text-xs text-on-surface-variant">
              If non-repairable, hand over <strong>{itemName || 'your item'}</strong> to an audited smelter for precious metals recovery and zero-landfill compliance documentation.
            </p>
            <div className="pt-2 border-t border-outline/10 flex items-center justify-between">
              <span className="text-xs text-outline font-mono truncate max-w-[240px]">Search: "{recycleSearchTerm}"</span>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(recycleSearchTerm)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline"
              >
                <span>Find on Map</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RepairRecyclePage;
