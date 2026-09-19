import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Listing, ListingCategory, ListingCondition } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const MarketplacePage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Form State for Listing Creation
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ListingCategory>('Electronics');
  const [condition, setCondition] = useState<ListingCondition>('Good');
  const [price, setPrice] = useState<string>('68000');
  const [isFree, setIsFree] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [location, setLocation] = useState('Bengaluru, KA');
  const [sellerNotes, setSellerNotes] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Initial Sample Listings
  const [listings, setListings] = useState<Listing[]>([
    {
      id: 'l-101',
      title: 'Dell PowerEdge R740 Server Units (x3)',
      description: 'Decommissioned from climate-controlled cloud suite. Tested RAM and redundant 750W power supply modules intact.',
      category: 'Electronics',
      condition: 'Good',
      price: 68000,
      quantity: 3,
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBlr-Tidf7cRRe4Ofg-IypeQ66-JEOP0aPw8tP7EKAChQLVWIUqDQmccf8G88rp1dJNHWmbslEHTTEluN7SjxnAdoRqVM0PhSDj5TheQAdFkYDw6QliX5jVoFq6f4PPNFCBoGW0CDOwWkHaetO3HwcdK0SqEO-lvynbMpJyicDJ_52DxnrqRiI6SPjVtJBn8-yuZYHDIGCZjLUD9zuNUAAcWQhpa-QLApcyTvVoljxoYMgT90gy-GDu'],
      location: 'Bengaluru, KA',
      postedBy: 'org-techcorp',
      postedByName: 'TechCorp Hub 4',
      postedByType: 'organization',
      status: 'Available',
      tags: ['electronics', 'servers', 'enterprise'],
      createdAt: '2026-09-18',
    },
    {
      id: 'l-102',
      title: 'Modular Oak Study Benches & Chairs (x15)',
      description: 'Surplus from tech park relocation. Minor cosmetic scuffs, mechanically rock solid. Ideal for community learning centers.',
      category: 'Furniture',
      condition: 'Fair',
      price: null, // Free / Give Away
      quantity: 15,
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDLtu22lrWEHOYxes-Kp2zKHFtFJvFkd5xmnV7QtmLPsas2Ua1TBydRh1Ijl8N5NkJlPtOYZ-S7SMfADSB137J4V2w3Uk9sHoCupe508hGb7LVzgss3mhF6PUO5yWXGFXfVgJoj6BJAWHThduzktaONqrk-zg9V8PlDyRAcW3St7H_A5yv3fBJFdGuDzx_uqVQhWFEY2M1PMpI0nOrN3M1qsb8lx7uK-cD6LtZEYDE3ylYEGC8Uug9K'],
      location: 'Ahmedabad, GJ',
      postedBy: 'org-greenfield',
      postedByName: 'GreenField Eco NGO',
      postedByType: 'organization',
      status: 'Available',
      tags: ['furniture', 'oak', 'donation'],
      createdAt: '2026-09-17',
    },
    {
      id: 'l-103',
      title: 'Precision Lathe 3-Phase Unit',
      description: 'Calibrated toolpost, includes secondary coolant pump and digital readout display. Complete servicing history available.',
      category: 'Machinery',
      condition: 'Good',
      price: 115000,
      quantity: 1,
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCcydkiMII4kUYh0tUY4qujRACGt5j_g-tU9ZaWeBNDWvL1r0MQnMC3YAS1v9M4Ta_aCoF1gUmqrjkCW_c7pHhoLDkxafCxKjMxKcrm9hadyzVZH_GUtejql2grdKZtmGw4tLsRbOnpNHKZXQCnmeaRzjUlIGy9v00Dkbmmqt9pHiCPm0qynqafJsF0JMOWX7FRDFVPaFNvJkPEyJx4ic5GUsnIrLUwPrzmMXng4zDmBXaTTRSYavdc'],
      location: 'Coimbatore, TN',
      postedBy: 'user-rakesh',
      postedByName: 'Rakesh Jena',
      postedByType: 'user',
      status: 'Available',
      tags: ['machinery', 'lathe', 'industrial'],
      createdAt: '2026-09-16',
    },
    {
      id: 'l-104',
      title: 'T-Slot Aluminum Extrusions 40x40 (450m)',
      description: 'Surplus from automated packaging line build. 6063-T5 alloy, anodized clear finish in original protective film.',
      category: 'Materials',
      condition: 'New',
      price: 32500,
      quantity: 450,
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAaVtMcO72tKYFPR2HAbkxRwCaWCfyfwx5wvcstUUvCL-CNajH-al3mfIIO0wJcvhdLdL9MbcDfKZwohn6dO2DsjiESrcJ4pUWGSo_QuHUZhiR_V9LBU-Udpj14pEbB4VTuIbHVbiC1jZh5MOZOuHzMfgoEygokS9feJ1dqtk4uoWpRY8a2295IaRLz2MTxGs6amYSlgHSbDxo7xmFzSf6V4I1SbzgkMtccqbM8W9JVnUWnl_V67Kfx'],
      location: 'Pune, MH',
      postedBy: 'org-bharatfab',
      postedByName: 'Bharat Fab Tech Ltd.',
      postedByType: 'organization',
      status: 'Available',
      tags: ['materials', 'aluminum', 'raw'],
      createdAt: '2026-09-15',
    },
  ]);

  // AI Description Generator Handler (Zero-Cost Deterministic)
  const handleGenerateAiDescription = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setDescription(
        `High-utility ${title || 'item'} (${category}) in ${condition} condition. ${sellerNotes || 'Maintained in clean operational environment. Verified for secondary circular reuse.'}`
      );
      setIsGeneratingAi(false);
    }, 400);
  };

  // Listing Submit Handler
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const newListing: Listing = {
      id: `l-${Date.now()}`,
      title,
      description,
      category,
      condition,
      price: isFree ? null : parseFloat(price) || 0,
      quantity: parseInt(quantity) || 1,
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAaVtMcO72tKYFPR2HAbkxRwCaWCfyfwx5wvcstUUvCL-CNajH-al3mfIIO0wJcvhdLdL9MbcDfKZwohn6dO2DsjiESrcJ4pUWGSo_QuHUZhiR_V9LBU-Udpj14pEbB4VTuIbHVbiC1jZh5MOZOuHzMfgoEygokS9feJ1dqtk4uoWpRY8a2295IaRLz2MTxGs6amYSlgHSbDxo7xmFzSf6V4I1SbzgkMtccqbM8W9JVnUWnl_V67Kfx'],
      location,
      postedBy: user?.uid || 'user-guest',
      postedByName: user?.displayName || 'User',
      postedByType: 'user',
      status: 'Available',
      tags: [category.toLowerCase(), condition.toLowerCase(), 'circular'],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setListings([newListing, ...listings]);
    setShowCreateModal(false);
    // Reset Form
    setTitle('');
    setDescription('');
    setSellerNotes('');
  };

  // Filter Logic
  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' ||
      (selectedCategory === 'Free' ? item.price === null : item.category === selectedCategory);

    const matchesCondition = selectedCondition === 'All' || item.condition === selectedCondition;

    const matchesCity = selectedCity === 'All' || item.location.toLowerCase().includes(selectedCity.toLowerCase());

    return matchesSearch && matchesCategory && matchesCondition && matchesCity;
  });

  return (
    <div className="pt-24 pb-16 max-w-[1440px] mx-auto px-4 md:px-margin">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display-hero text-3xl font-bold text-primary">
              Circular Marketplace
            </h1>
            <Badge variant="accent" icon="autorenew">Secondary Asset Exchange</Badge>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Discover and list reusable equipment, excess raw materials, and modular furniture.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          icon={<span className="material-symbols-outlined text-[18px]">add_box</span>}
        >
          Create New Listing
        </Button>
      </div>

      {/* Filter & Search Toolbar */}
      <Card className="mb-8 border border-outline/10 p-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {['All', 'Electronics', 'Furniture', 'Machinery', 'Materials', 'Free'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat === 'Free' ? '🎁 Free / Give Away' : cat}
              </button>
            ))}
          </div>

          {/* Search Input & City Dropdown */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search title, specs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline border border-outline/20 focus:outline-none focus:border-secondary"
              />
            </div>

            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="py-2 px-3 text-xs rounded-lg bg-surface-container-low text-on-surface border border-outline/20"
            >
              <option value="All">All Conditions</option>
              <option value="New">New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="For Parts">For Parts</option>
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="py-2 px-3 text-xs rounded-lg bg-surface-container-low text-on-surface border border-outline/20"
            >
              <option value="All">All Cities</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Pune">Pune</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Listing Cards Grid */}
      {filteredListings.length === 0 ? (
        <Card className="text-center py-12 border border-outline/10">
          <span className="material-symbols-outlined text-[48px] text-outline mb-2">search_off</span>
          <h3 className="font-headline-sm text-lg font-bold text-primary">No Matching Listings Found</h3>
          <p className="font-body-md text-xs text-on-surface-variant mt-1">Try resetting your category or location filters.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredListings.map((item) => (
            <Card key={item.id} hoverable className="flex flex-col justify-between border border-outline/10 p-0 overflow-hidden">
              <div className="relative h-48 bg-surface-container">
                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm text-[11px] font-semibold">
                  {item.category}
                </span>
                <span className="absolute top-3 right-3">
                  {item.price === null ? (
                    <Badge variant="free" icon="volunteer_activism">Free</Badge>
                  ) : (
                    <Badge variant="secondary">{item.condition}</Badge>
                  )}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-[11px] mb-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {item.location}
                    </span>
                    <span className="text-secondary font-semibold">{item.postedByName}</span>
                  </div>
                  <h3 className="font-headline-sm text-base font-bold text-primary leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-outline/10 flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    {item.price === null ? (
                      <span className="font-headline-sm text-xl font-bold text-secondary">₹0</span>
                    ) : (
                      <span className="font-headline-sm text-xl font-bold text-primary">₹{item.price.toLocaleString()}</span>
                    )}
                    <span className="font-label-sm text-[11px] text-on-surface-variant">{item.quantity} available</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedListing(item)}
                    icon={<span className="material-symbols-outlined text-[16px]">visibility</span>}
                    className="w-full"
                  >
                    View Details & Contact
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View Listing Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-xl border border-outline/10 p-6 shadow-2xl bg-surface-container-lowest max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-outline/10 mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedListing.category}</Badge>
                <Badge variant="neutral">{selectedListing.condition}</Badge>
              </div>
              <button onClick={() => setSelectedListing(null)} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <h2 className="font-headline-sm text-xl font-bold text-primary mb-2">{selectedListing.title}</h2>
            <p className="font-body-md text-sm text-on-surface-variant mb-4">{selectedListing.description}</p>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-surface-container-low mb-4 font-label-sm text-xs">
              <div>
                <span className="text-outline">Price:</span>{' '}
                <strong className="text-primary">{selectedListing.price ? `₹${selectedListing.price.toLocaleString()}` : 'Free / Give Away'}</strong>
              </div>
              <div>
                <span className="text-outline">Location:</span> <strong className="text-primary">{selectedListing.location}</strong>
              </div>
              <div>
                <span className="text-outline">Seller:</span> <strong className="text-primary">{selectedListing.postedByName}</strong>
              </div>
              <div>
                <span className="text-outline">Quantity:</span> <strong className="text-primary">{selectedListing.quantity} unit(s)</strong>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setSelectedListing(null)}>Close</Button>
              <Button variant="primary" icon={<span className="material-symbols-outlined text-[18px]">chat</span>}>
                Contact Seller & Ask AI
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-xl border border-outline/10 p-6 shadow-2xl bg-surface-container-lowest max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-outline/10 mb-4">
              <h3 className="font-headline-sm text-xl font-bold text-primary">Create Marketplace Listing</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="flex flex-col gap-4">
              <Input
                label="Item Title"
                placeholder="e.g. Ergonomic Office Desk Chairs (Set of 4)"
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

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-xs font-semibold text-primary">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ListingCondition)}
                    className="py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20"
                  >
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="For Parts">For Parts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-xs font-semibold text-primary">Price (₹)</label>
                  <input
                    type="number"
                    disabled={isFree}
                    placeholder="e.g. 15000"
                    value={isFree ? '' : price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20 disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="freeItem"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="w-4 h-4 text-secondary rounded"
                  />
                  <label htmlFor="freeItem" className="text-xs font-bold text-primary cursor-pointer">
                    🎁 Free / Give Away (Price = Null)
                  </label>
                </div>
              </div>

              <Input
                label="Location (City)"
                placeholder="e.g. Bengaluru, KA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-label-sm text-xs font-semibold text-primary">Seller Notes</label>
                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={isGeneratingAi}
                    className="text-xs text-secondary font-bold hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                    <span>Generate Description with AI</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Fully functional, minor scuffs from relocation..."
                  value={sellerNotes}
                  onChange={(e) => setSellerNotes(e.target.value)}
                  className="py-2 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs border border-outline/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-xs font-semibold text-primary">Item Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20"
                />
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Publish Listing</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
