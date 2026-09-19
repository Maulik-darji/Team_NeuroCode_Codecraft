import React, { useState, useEffect, useMemo } from 'react';
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
import { Requirement, ListingCategory, RequirementStatus } from '../../types';
import { INDIAN_STATES_AND_CITIES } from '../../data/indianLocations';
import { DEMO_REQUIREMENTS } from '../../data/demoRequirements';
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
  const [contactingReqId, setContactingReqId] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'budget_high' | 'budget_low'>('newest');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [detectedLocationLabel, setDetectedLocationLabel] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ListingCategory>('Electronics');
  const [maxBudget, setMaxBudget] = useState('70000');
  const [location, setLocation] = useState('Bengaluru, KA');
  const [description, setDescription] = useState('');

  // Debounce Search Handler
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim().toLowerCase());
    }, 280);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Flattened Cities List for Location Filter
  const ALL_CITIES = useMemo(() => {
    const set = new Set<string>();
    INDIAN_STATES_AND_CITIES.forEach((sc) => {
      sc.cities.forEach((c) => set.add(c));
    });
    return Array.from(set).sort();
  }, []);

  // Location Auto-Detect Handler
  const handleAutoDetectLocation = async () => {
    setIsDetectingLocation(true);

    const tryIpGeolocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data && data.city) {
            const detectedCity = data.city;
            const region = data.region_code || data.region || 'India';
            setSelectedCity(detectedCity);
            setLocation(`${detectedCity}, ${region}`);
            setDetectedLocationLabel(`${detectedCity}, ${region} (IP Geolocation)`);
            setIsDetectingLocation(false);
            return true;
          }
        }
      } catch (e) {}
      return false;
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            if (res.ok) {
              const data = await res.json();
              if (data?.address) {
                const city =
                  data.address.city ||
                  data.address.town ||
                  data.address.village ||
                  data.address.municipality ||
                  data.address.county ||
                  'Detected City';
                const state = data.address.state || '';
                const fullLoc = state ? `${city}, ${state}` : city;

                setSelectedCity(city);
                setLocation(fullLoc);
                setDetectedLocationLabel(`${fullLoc} (GPS Resolved)`);
                setIsDetectingLocation(false);
                return;
              }
            }
          } catch (e) {}

          const ipSuccess = await tryIpGeolocation();
          if (!ipSuccess) {
            const userLoc = userProfile?.location || 'Bengaluru, KA';
            const detectedCity = userLoc.includes(',') ? userLoc.split(',')[0].trim() : userLoc;
            setSelectedCity(detectedCity);
            setLocation(userLoc);
            setDetectedLocationLabel(`${userLoc} (GPS Fallback)`);
            setIsDetectingLocation(false);
          }
        },
        async () => {
          const ipSuccess = await tryIpGeolocation();
          if (!ipSuccess) {
            const fallbackLoc = userProfile?.location || 'Bengaluru, KA';
            const fallbackCity = fallbackLoc.includes(',') ? fallbackLoc.split(',')[0].trim() : fallbackLoc;
            setSelectedCity(fallbackCity);
            setLocation(fallbackLoc);
            setDetectedLocationLabel(`${fallbackLoc} (Profile Fallback)`);
            setIsDetectingLocation(false);
          }
        },
        { timeout: 6000, enableHighAccuracy: true }
      );
    } else {
      const ipSuccess = await tryIpGeolocation();
      if (!ipSuccess) {
        const fallbackLoc = userProfile?.location || 'Bengaluru, KA';
        const fallbackCity = fallbackLoc.includes(',') ? fallbackLoc.split(',')[0].trim() : fallbackLoc;
        setSelectedCity(fallbackCity);
        setLocation(fallbackLoc);
        setDetectedLocationLabel(`${fallbackLoc} (Default)`);
        setIsDetectingLocation(false);
      }
    }
  };

  // Firestore Realtime Listener for Requirements
  useEffect(() => {
    const q = query(collection(db, 'requirements'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
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
        const fetchedIds = new Set(fetched.map((r) => r.id));
        const demoToMerge = DEMO_REQUIREMENTS.filter((dr) => !fetchedIds.has(dr.id));
        setRequirements([...fetched, ...demoToMerge]);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore requirements listener error:', err);
        setRequirements(DEMO_REQUIREMENTS);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter & Sort Logic
  const filteredRequirements = useMemo(() => {
    return requirements
      .filter((req) => {
        if (debouncedSearch) {
          const matchTitle = req.title.toLowerCase().includes(debouncedSearch);
          const matchDesc = req.description.toLowerCase().includes(debouncedSearch);
          const matchLoc = req.location.toLowerCase().includes(debouncedSearch);
          const matchCategory = req.category.toLowerCase().includes(debouncedSearch);
          if (!matchTitle && !matchDesc && !matchLoc && !matchCategory) return false;
        }

        if (selectedCategory !== 'All' && req.category !== selectedCategory) {
          return false;
        }

        if (selectedStatus !== 'All' && req.status !== selectedStatus) {
          return false;
        }

        if (selectedCity !== 'All') {
          const locLower = req.location.toLowerCase();
          const cityLower = selectedCity.toLowerCase();
          if (!locLower.includes(cityLower)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'budget_high') {
          return (b.maxBudget || 0) - (a.maxBudget || 0);
        }
        if (sortBy === 'budget_low') {
          return (a.maxBudget || 0) - (b.maxBudget || 0);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [requirements, debouncedSearch, selectedCategory, selectedStatus, selectedCity, sortBy]);

  // Pre-fill location when posting requirement
  useEffect(() => {
    if (showModal) {
      if (userProfile?.location) {
        setLocation(userProfile.location);
      } else if (selectedCity !== 'All') {
        setLocation(selectedCity);
      }
    }
  }, [showModal, userProfile, selectedCity]);

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
        matchedListings: [],
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

  const handleContactRequester = async (req: Requirement) => {
    if (!user) {
      alert('Please sign in to contact the buyer who posted this request.');
      navigate('/login');
      return;
    }

    if (user.uid === req.postedBy) {
      alert('This is your own posted item request.');
      return;
    }

    setContactingReqId(req.id);

    try {
      const convId = `conv_${req.id}_${user.uid}`;
      const convRef = doc(db, 'conversations', convId);

      const convData = {
        id: convId,
        listingId: req.id,
        listingTitle: `[Item Request] ${req.title}`,
        buyerUid: req.postedBy,
        buyerName: req.postedByName || 'Buyer',
        sellerUid: user.uid,
        sellerName: userProfile?.displayName || user.displayName || user.email?.split('@')[0] || 'Seller',
        aiHandled: true,
        escalated: false,
        createdAt: new Date().toISOString(),
        lastMessage: `Hi ${req.postedByName}, I saw your request for "${req.title}" and I have an item that fits your budget!`,
        lastMessageAt: new Date().toISOString(),
      };

      await setDoc(convRef, convData, { merge: true });

      // Seed message in subcollection
      const msgId = `msg_${Date.now()}`;
      await setDoc(doc(db, 'conversations', convId, 'messages', msgId), {
        id: msgId,
        sender: 'seller',
        text: `Hello ${req.postedByName}! I saw your request for "${req.title}" (Max Budget: ₹${req.maxBudget?.toLocaleString()}). I have an available item in ${req.location} that matches your requirements. Let's discuss details!`,
        sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      navigate(`/conversations?id=${convId}`);
    } catch (err: any) {
      console.error('Failed to initiate buyer conversation:', err);
      alert('Could not start conversation. Please try again.');
    } finally {
      setContactingReqId(null);
    }
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedCity('All');
    setSortBy('newest');
  };

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedStatus !== 'All' ? 1 : 0) +
    (selectedCity !== 'All' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="pt-24 pb-16 max-w-[1440px] mx-auto px-4 md:px-margin">
      {/* Header & Primary Action */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display-hero text-3xl font-bold text-primary">
              Resource Requirements & Item Requests
            </h1>
            <Badge variant="primary" icon="find_in_page">Item Sourcing</Badge>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Browse buyer requests or post what you need. CircleLoop automatically pairs queries with matching secondary listings.
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

      {/* Location Auto-Detect & Regional Hub Bar */}
      <div className="mb-6 bg-surface-container-lowest border border-outline/15 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[22px]">location_on</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-sm font-bold text-primary">
                Regional Hub & City Filter
              </span>
              {selectedCity !== 'All' && (
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed-variant text-[11px] font-mono font-semibold">
                  {selectedCity}
                </span>
              )}
            </div>
            <span className="font-body-sm text-xs text-on-surface-variant block mt-0.5">
              {detectedLocationLabel ? detectedLocationLabel : 'Select a city or auto-detect your location to filter item requests nearby.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface border border-outline/20 text-xs font-medium text-primary focus:outline-none focus:border-secondary flex-1 md:flex-none"
          >
            <option value="All">All Locations & Cities</option>
            {ALL_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoDetectLocation}
            disabled={isDetectingLocation}
            className="whitespace-nowrap flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isDetectingLocation ? 'sync' : 'my_location'}
            </span>
            <span>{isDetectingLocation ? 'Detecting...' : 'Auto-Detect'}</span>
          </Button>
        </div>
      </div>

      {/* Comprehensive Filter Controls */}
      <Card className="p-4 mb-8 border border-outline/10 bg-surface shadow-xs flex flex-col gap-4">
        {/* Search Bar & Sort Row */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search requirements by item name, details, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 text-xs rounded-xl bg-surface-container-low border border-outline/20 text-primary placeholder:text-outline focus:outline-none focus:border-secondary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-on-surface-variant font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline/20 text-xs font-medium text-primary focus:outline-none focus:border-secondary"
              >
                <option value="newest">Newest First</option>
                <option value="budget_high">Highest Budget First</option>
                <option value="budget_low">Lowest Budget First</option>
              </select>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-error font-bold hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
                <span>Reset Filters ({activeFilterCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Category & Status Filter Pills */}
        <div className="flex flex-col sm:flex-row gap-4 pt-3 border-t border-outline/10 justify-between items-start sm:items-center">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-primary mr-1">Category:</span>
            {['All', 'Electronics', 'Furniture', 'Machinery', 'Materials', 'Other'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary font-bold shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-primary mr-1">Status:</span>
            {['All', 'Open', 'Fulfilled', 'Expired'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedStatus === st
                    ? 'bg-secondary text-on-secondary font-bold shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold text-on-surface-variant">
          Showing <span className="text-primary">{filteredRequirements.length}</span> item request{filteredRequirements.length !== 1 ? 's' : ''}
          {selectedCity !== 'All' ? ` in ${selectedCity}` : ''}
        </p>
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

      {!loading && filteredRequirements.length === 0 && (
        <Card className="text-center py-16 border border-outline/10 bg-surface">
          <span className="material-symbols-outlined text-outline text-[48px] mb-2">find_in_page</span>
          <h3 className="font-headline-sm text-xl font-bold text-primary">No Matching Item Requests Found</h3>
          <p className="font-body-md text-xs text-on-surface-variant max-w-md mx-auto mt-1 mb-6">
            {activeFilterCount > 0
              ? 'Try changing your filters or city selection to view more requests.'
              : 'Post your material or equipment needs here so sellers and organizations can fulfill your requests.'}
          </p>
          {activeFilterCount > 0 ? (
            <Button variant="outline" onClick={resetAllFilters}>
              Reset All Filters
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                if (!user) navigate('/login');
                else setShowModal(true);
              }}
            >
              Post First Requirement
            </Button>
          )}
        </Card>
      )}

      {!loading && filteredRequirements.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequirements.map((req) => (
            <Card key={req.id} className="border border-outline/10 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{req.category}</Badge>
                  <Badge
                    variant={req.status === 'Open' ? 'warning' : req.status === 'Fulfilled' ? 'accent' : 'neutral'}
                    icon={req.status === 'Open' ? 'hourglass_top' : req.status === 'Fulfilled' ? 'check_circle' : 'history'}
                  >
                    {req.status}
                  </Badge>
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

                <div className="mt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleContactRequester(req)}
                    isLoading={contactingReqId === req.id}
                    icon={<span className="material-symbols-outlined text-[16px]">chat</span>}
                    className="w-full justify-center text-xs py-2.5"
                  >
                    Contact Buyer to Offer
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

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-label-sm text-xs font-semibold text-primary">Location (City)</label>
                  <button
                    type="button"
                    onClick={handleAutoDetectLocation}
                    className="text-[11px] text-secondary font-bold hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">my_location</span>
                    <span>Auto-Detect My Location</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bengaluru, KA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20"
                />
              </div>

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
