import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { Requirement, ListingCategory } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';

export const RequirementsPage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ListingCategory>('Electronics');
  const [maxBudget, setMaxBudget] = useState('70000');
  const [location, setLocation] = useState('Bengaluru, KA');
  const [description, setDescription] = useState('');

  // Firestore Realtime Listener for Requirements
  useEffect(() => {
    const q = query(collection(db, 'requirements'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Requirement[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetched.push({
          id: docSnap.id,
          title: data.title || 'Sourcing Query',
          description: data.description || '',
          category: data.category || 'Electronics',
          maxBudget: data.maxBudget === undefined ? 0 : Number(data.maxBudget),
          location: data.location || 'India',
          postedBy: data.postedBy || 'user-unknown',
          postedByName: data.postedByName || 'Anonymous User',
          matchedListings: Array.isArray(data.matchedListings) ? data.matchedListings : [],
          status: data.status || 'Open',
          createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString().split('T')[0],
        });
      });
      setRequirements(fetched);
      setLoading(false);
    }, (err) => {
      console.error('Firestore requirements listener error:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be signed in to post a requirement.');
      navigate('/login');
      return;
    }

    if (!title.trim() || !description.trim() || !location.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const reqId = `req_${Date.now()}`;
      const newReqData = {
        title: title.trim(),
        description: description.trim(),
        category,
        maxBudget: parseFloat(maxBudget) || 0,
        location: location.trim(),
        postedBy: user.uid,
        postedByName: userProfile?.displayName || user.displayName || user.email?.split('@')[0] || 'User',
        matchedListings: [], // Dynamic matching
        status: 'Open',
        createdAt: new Date().toISOString().split('T')[0],
      };

      await setDoc(doc(db, 'requirements', reqId), newReqData);

      setShowModal(false);
      setTitle('');
      setDescription('');
      setMaxBudget('70000');
    } catch (err: any) {
      console.error('Failed to post requirement:', err);
      alert('Could not post requirement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewMatch = (category: string) => {
    navigate(`/marketplace?category=${encodeURIComponent(category)}`);
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
          onClick={() => {
            if (!user) {
              alert('Please sign in to post a requirement.');
              navigate('/login');
              return;
            }
            setShowModal(true);
          }}
          icon={<span className="material-symbols-outlined text-[18px]">post_add</span>}
        >
          Post New Requirement
        </Button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="border border-outline/10 p-6 animate-pulse">
              <div className="h-6 w-1/3 bg-surface-container-high rounded mb-4" />
              <div className="h-5 w-3/4 bg-surface-container-high rounded mb-2" />
              <div className="h-4 w-full bg-surface-container-low rounded" />
            </Card>
          ))}
        </div>
      )}

      {!loading && requirements.length === 0 && (
        <Card className="text-center py-16 border border-outline/10 bg-surface">
          <span className="material-symbols-outlined text-outline text-[48px] mb-2">find_in_page</span>
          <h3 className="font-headline-sm text-xl font-bold text-primary">No Requirements Posted Yet</h3>
          <p className="font-body-md text-xs text-on-surface-variant max-w-md mx-auto mt-1 mb-6">
            Post your material or equipment needs here so sellers and organizations can fulfill your requests.
          </p>
          <Button
            variant="primary"
            onClick={() => {
              if (!user) navigate('/login');
              else setShowModal(true);
            }}
          >
            Post First Requirement
          </Button>
        </Card>
      )}

      {!loading && requirements.length > 0 && (
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
                    <strong className="text-primary">
                      {req.maxBudget === 0 ? 'Donation Request (₹0)' : `₹${req.maxBudget?.toLocaleString()}`}
                    </strong>
                  </div>
                  <div>
                    <span className="text-outline">Location:</span> <strong className="text-primary">{req.location}</strong>
                  </div>
                </div>

                {/* Matched Listings Action */}
                <div className="p-3 rounded-lg bg-secondary-fixed/20 border border-secondary/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">task_alt</span>
                    <span className="text-xs text-primary font-bold">
                      Explore Matching Listings in {req.category}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewMatch(req.category)}
                    className="text-secondary font-bold hover:underline"
                  >
                    View Match →
                  </Button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-outline/10 flex items-center justify-between text-xs text-on-surface-variant font-mono">
                <span>Posted by: <strong>{req.postedByName}</strong></span>
                <span>{req.createdAt}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

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
                label="Requirement Title *"
                placeholder="e.g. Need 5 used office chairs in Ahmedabad"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-xs font-semibold text-primary">Category *</label>
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
                  label="Max Budget (₹) *"
                  placeholder="0 for donation request"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Location (City) *"
                placeholder="e.g. Bengaluru, KA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-xs font-semibold text-primary">Detailed Description *</label>
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
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                  Post Requirement to Firestore
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RequirementsPage;
