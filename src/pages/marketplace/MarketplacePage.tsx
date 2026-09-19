import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { Listing, ListingCategory, ListingCondition } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const MarketplacePage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  // Firestore Data State
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [isFreeOnly, setIsFreeOnly] = useState(false);

  // Modal States
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State for Create Listing
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ListingCategory>('Electronics');
  const [condition, setCondition] = useState<ListingCondition>('Good');
  const [price, setPrice] = useState<string>('15000');
  const [isFree, setIsFree] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [location, setLocation] = useState('Bengaluru, KA');
  const [city, setCity] = useState('Bengaluru');
  const [sellerNotes, setSellerNotes] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formValidationMsg, setFormValidationMsg] = useState<string | null>(null);
  const [contactingSellerId, setContactingSellerId] = useState<string | null>(null);

  // Debounce Search Handler (280ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim().toLowerCase());
    }, 280);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Realtime Firestore Subscription
  useEffect(() => {
    setLoading(true);
    setFetchError(null);

    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedListings: Listing[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedListings.push({
            id: docSnap.id,
            title: data.title || 'Untitled Asset',
            description: data.description || '',
            category: data.category || 'Other',
            condition: data.condition || 'Good',
            price: data.price === null || data.price === undefined ? null : Number(data.price),
            quantity: Number(data.quantity) || 1,
            images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [],
            location: data.location || data.city || 'India',
            city: data.city || (data.location ? data.location.split(',')[0].trim() : 'India'),
            postedBy: data.postedBy || 'user-unknown',
            postedByName: data.postedByName || 'Anonymous User',
            postedByType: data.postedByType || 'user',
            status: data.status || 'Available',
            tags: Array.isArray(data.tags) ? data.tags : [],
            createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString(),
          });
        });

        setListings(fetchedListings);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore listings query error:', err);
        setFetchError('Unable to load marketplace listings from server. Please try again.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Image Selection & Validation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);

    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    for (const file of selected) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert(`File ${file.name} is not a supported image format (JPEG, PNG, WEBP).`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} exceeds the 5MB size limit.`);
        continue;
      }
      if (validFiles.length + imageFiles.length >= 4) {
        alert('Maximum 4 images allowed per listing.');
        break;
      }
      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    }

    setImageFiles((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...validPreviews]);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Deterministic AI Description Helper (Zero External API Key)
  const handleGenerateAiDescription = () => {
    if (!title.trim()) {
      setFormValidationMsg('Please enter an Item Title first to generate AI description.');
      return;
    }
    setFormValidationMsg(null);
    const generated = `Verified high-utility ${title.trim()} (${category}) in ${condition} condition. ${
      sellerNotes.trim()
        ? `Seller Notes: ${sellerNotes.trim()}.`
        : 'Maintained in clean operational environment.'
    } Suitable for secondary circular reuse and landfill diversion in ${location}.`;
    setDescription(generated);
  };

  // Create Listing Submission Flow
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setFormValidationMsg(null);

    if (!user) {
      alert('You must be signed in to create a listing.');
      navigate('/login');
      return;
    }

    // Input Validation
    if (!title.trim() || title.trim().length < 3) {
      setFormValidationMsg('Title must be at least 3 characters long.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setFormValidationMsg('Please provide a detailed description (minimum 10 characters).');
      return;
    }
    if (!location.trim()) {
      setFormValidationMsg('Location / City is required.');
      return;
    }

    const numQuantity = parseInt(quantity, 10);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      setFormValidationMsg('Quantity must be a positive number (minimum 1).');
      return;
    }

    let parsedPrice: number | null = null;
    if (!isFree) {
      const numPrice = parseFloat(price);
      if (isNaN(numPrice) || numPrice < 0) {
        setFormValidationMsg('Price must be a valid positive number or set to Free / Giveaway.');
        return;
      }
      parsedPrice = numPrice;
    }

    setIsSubmitting(true);

    try {
      const listingId = `list_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const uploadedImageUrls: string[] = [];

      // Upload selected image files to Firebase Storage
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const fileExt = file.name.split('.').pop() || 'jpg';
          const storagePath = `listings/${user.uid}/${listingId}/img_${i + 1}_${Date.now()}.${fileExt}`;
          const storageRef = ref(storage, storagePath);
          await uploadBytes(storageRef, file);
          const downloadUrl = await getDownloadURL(storageRef);
          uploadedImageUrls.push(downloadUrl);
        }
      }

      const extractedCity = location.includes(',')
        ? location.split(',')[0].trim()
        : location.trim();

      const newListingData: Omit<Listing, 'id'> = {
        title: title.trim(),
        description: description.trim(),
        category,
        condition,
        price: parsedPrice,
        quantity: numQuantity,
        images: uploadedImageUrls,
        location: location.trim(),
        city: extractedCity,
        postedBy: user.uid,
        postedByName: userProfile?.displayName || user.displayName || user.email?.split('@')[0] || 'Seller',
        postedByType: userProfile?.role === 'org_admin' || userProfile?.role === 'org_member' ? 'organization' : 'user',
        status: 'Available',
        tags: [category.toLowerCase(), condition.toLowerCase(), 'circular-reuse'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Write document to Firestore `listings` collection
      await setDoc(doc(db, 'listings', listingId), newListingData);

      // Reset Form State
      setTitle('');
      setDescription('');
      setSellerNotes('');
      setPrice('15000');
      setIsFree(false);
      setQuantity('1');
      setImageFiles([]);
      setImagePreviews([]);
      setShowCreateModal(false);
    } catch (err: any) {
      console.error('Create listing Firestore/Storage failure:', err);
      setSubmitError(err.message || 'Failed to publish listing. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact Seller Handler (Creates/opens Firestore Conversation)
  const handleContactSeller = async (listing: Listing) => {
    if (!user) {
      alert('Please sign in to contact the seller.');
      navigate('/login');
      return;
    }

    if (user.uid === listing.postedBy) {
      alert('This is your own listing.');
      return;
    }

    setContactingSellerId(listing.id);

    try {
      const convId = `conv_${listing.id}_${user.uid}`;
      const convRef = doc(db, 'conversations', convId);

      const convData = {
        id: convId,
        listingId: listing.id,
        listingTitle: listing.title,
        buyerUid: user.uid,
        buyerName: userProfile?.displayName || user.displayName || 'Buyer',
        sellerUid: listing.postedBy,
        sellerName: listing.postedByName || 'Seller',
        aiHandled: true,
        escalated: false,
        createdAt: new Date().toISOString(),
        lastMessage: `Hi, I am interested in ${listing.title}. Is it available?`,
        lastMessageAt: new Date().toISOString(),
      };

      await setDoc(convRef, convData, { merge: true });

      // Add seed message in subcollection
      const msgId = `msg_${Date.now()}`;
      await setDoc(doc(db, 'conversations', convId, 'messages', msgId), {
        id: msgId,
        sender: 'buyer',
        text: `Hello! I am interested in your listing: ${listing.title}. Location: ${listing.location}.`,
        sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      setSelectedListing(null);
      navigate(`/conversations?id=${convId}`);
    } catch (err: any) {
      console.error('Failed to initiate conversation:', err);
      alert('Could not start conversation. Please try again.');
    } finally {
      setContactingSellerId(null);
    }
  };

  // Combined Filters Logic
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesSearch =
        !debouncedSearch ||
        item.title.toLowerCase().includes(debouncedSearch) ||
        item.description.toLowerCase().includes(debouncedSearch) ||
        item.location.toLowerCase().includes(debouncedSearch) ||
        (item.city && item.city.toLowerCase().includes(debouncedSearch)) ||
        item.category.toLowerCase().includes(debouncedSearch);

      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const matchesCondition =
        selectedCondition === 'All' || item.condition === selectedCondition;

      const matchesCity =
        selectedCity === 'All' ||
        item.location.toLowerCase().includes(selectedCity.toLowerCase()) ||
        (item.city && item.city.toLowerCase() === selectedCity.toLowerCase());

      const matchesFree = !isFreeOnly || item.price === null || item.price === 0;

      return matchesSearch && matchesCategory && matchesCondition && matchesCity && matchesFree;
    });
  }, [listings, debouncedSearch, selectedCategory, selectedCondition, selectedCity, isFreeOnly]);

  // Unique Cities Extracted from Live Listings
  const availableCities = useMemo(() => {
    const citiesSet = new Set<string>();
    listings.forEach((item) => {
      if (item.city) citiesSet.add(item.city);
      else if (item.location) citiesSet.add(item.location.split(',')[0].trim());
    });
    return Array.from(citiesSet);
  }, [listings]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedCategory('All');
    setSelectedCondition('All');
    setSelectedCity('All');
    setIsFreeOnly(false);
  };

  return (
    <div className="pt-24 pb-16 max-w-[1440px] mx-auto px-4 md:px-margin">
      {/* Header & Primary Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display-hero text-3xl font-bold text-primary">
              Circular Marketplace
            </h1>
            <Badge variant="accent" icon="bolt">Firestore Live</Badge>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Browse and list reusable industrial equipment, surplus materials, and modular furniture.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            if (!user) {
              alert('Please sign in to create a listing.');
              navigate('/login');
              return;
            }
            setShowCreateModal(true);
          }}
          icon={<span className="material-symbols-outlined text-[18px]">add_box</span>}
        >
          Create New Listing
        </Button>
      </div>

      {/* Filter Toolbar Console */}
      <Card className="mb-8 border border-outline/10 p-4 shadow-sm bg-surface">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {['All', 'Electronics', 'Furniture', 'Machinery', 'Materials', 'Other'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input & Select Filters */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search title, specs, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline border border-outline/20 focus:outline-none focus:border-secondary"
              />
            </div>

            {/* Condition Filter */}
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="py-2 px-3 text-xs rounded-lg bg-surface-container-low text-on-surface border border-outline/20 focus:outline-none"
            >
              <option value="All">All Conditions</option>
              <option value="New">New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="For Parts">For Parts</option>
            </select>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="py-2 px-3 text-xs rounded-lg bg-surface-container-low text-on-surface border border-outline/20 focus:outline-none"
            >
              <option value="All">All Cities</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Free / Giveaway Toggle */}
            <button
              type="button"
              onClick={() => setIsFreeOnly(!isFreeOnly)}
              className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isFreeOnly
                  ? 'bg-secondary text-on-primary shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
              }`}
            >
              <span>🎁 Free Only</span>
            </button>

            {/* Reset Filters */}
            <button
              type="button"
              onClick={resetAllFilters}
              title="Reset All Filters"
              className="h-8 px-2.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-error transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Meta Result Counter */}
      <div className="flex items-center justify-between mb-4 text-xs font-mono text-on-surface-variant">
        <span>
          Showing <strong>{filteredListings.length}</strong> of {listings.length} active listings
        </span>
        {user && (
          <span className="text-secondary font-semibold">
            Logged in as: {userProfile?.displayName || user.email}
          </span>
        )}
      </div>

      {/* STATE 1: LOADING SKELETON GRID */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-outline/10 p-0 overflow-hidden flex flex-col">
              <div className="h-48 bg-surface-container-high animate-pulse" />
              <div className="p-4 flex flex-col gap-3">
                <div className="h-5 w-3/4 bg-surface-container-high rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-surface-container-high rounded animate-pulse" />
                <div className="h-8 w-full bg-surface-container-low rounded animate-pulse mt-2" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* STATE 2: FETCH ERROR ALERT */}
      {!loading && fetchError && (
        <Card className="text-center py-10 border border-error/20 bg-error-container/20">
          <span className="material-symbols-outlined text-error text-[48px] mb-2">cloud_off</span>
          <h3 className="font-headline-sm text-lg font-bold text-error">{fetchError}</h3>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mt-4">
            Retry Loading
          </Button>
        </Card>
      )}

      {/* STATE 3: EMPTY MARKETPLACE STATE */}
      {!loading && !fetchError && filteredListings.length === 0 && (
        <Card className="text-center py-16 border border-outline/10 bg-surface">
          <div className="w-16 h-16 rounded-full bg-secondary-container/40 flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-secondary text-[36px]">inventory_2</span>
          </div>
          <h3 className="font-headline-sm text-xl font-bold text-primary">No Matching Listings Found</h3>
          <p className="font-body-md text-xs text-on-surface-variant max-w-md mx-auto mt-1 mb-6">
            Be the first to give an unused industrial item or resource a second life. List equipment, spare parts, or materials for verified circular reuse.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              variant="primary"
              onClick={() => {
                if (!user) navigate('/login');
                else setShowCreateModal(true);
              }}
              icon={<span className="material-symbols-outlined text-[18px]">add_circle</span>}
            >
              + Create First Listing
            </Button>
            <Button variant="outline" onClick={resetAllFilters}>
              Reset Filters
            </Button>
          </div>
        </Card>
      )}

      {/* STATE 4: ACTIVE REAL DATA GRID */}
      {!loading && !fetchError && filteredListings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredListings.map((item) => (
            <Card
              key={item.id}
              hoverable
              className="flex flex-col justify-between border border-outline/10 p-0 overflow-hidden bg-surface"
            >
              {/* Image Container with Fallback */}
              <div className="relative h-48 bg-surface-container">
                {item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback image error
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-surface-container-high via-surface-container to-surface-dim flex flex-col items-center justify-center p-4 text-center">
                    <span className="material-symbols-outlined text-primary text-[36px] mb-1">
                      category
                    </span>
                    <span className="font-label-sm text-[11px] font-bold text-primary">
                      {item.category}
                    </span>
                  </div>
                )}

                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm text-[11px] font-semibold">
                  {item.category}
                </span>

                <span className="absolute top-3 right-3">
                  {item.price === null || item.price === 0 ? (
                    <Badge variant="free" icon="volunteer_activism">Free</Badge>
                  ) : (
                    <Badge variant="secondary">{item.condition}</Badge>
                  )}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-[11px] mb-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary">
                        location_on
                      </span>
                      {item.location}
                    </span>
                    <span className="text-secondary font-semibold truncate max-w-[120px]">
                      {item.postedByName}
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-base font-bold text-primary leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-outline/10 flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    {item.price === null || item.price === 0 ? (
                      <span className="font-headline-sm text-xl font-bold text-secondary">
                        ₹0 <span className="text-xs text-on-surface-variant font-normal">FREE</span>
                      </span>
                    ) : (
                      <span className="font-headline-sm text-xl font-bold text-primary">
                        ₹{item.price.toLocaleString()}
                      </span>
                    )}
                    <span className="font-label-sm text-[11px] text-on-surface-variant">
                      {item.quantity} available
                    </span>
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

      {/* VIEW LISTING DETAILS MODAL */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border border-outline/10 p-6 shadow-2xl bg-surface-container-lowest max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-outline/10 mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedListing.category}</Badge>
                <Badge variant="neutral">{selectedListing.condition}</Badge>
                <span className="text-xs text-outline font-mono">
                  ID: #{selectedListing.id.slice(-6)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedListing(null)}
                className="text-outline hover:text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Image Preview Gallery */}
            {selectedListing.images.length > 0 && (
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedListing.images.map((imgUrl, idx) => (
                  <div key={idx} className="h-44 rounded-lg overflow-hidden bg-surface-container">
                    <img src={imgUrl} alt={`Asset view ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <h2 className="font-headline-sm text-xl font-bold text-primary mb-2">
              {selectedListing.title}
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant mb-4 whitespace-pre-line">
              {selectedListing.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-surface-container-low mb-4 font-label-sm text-xs">
              <div>
                <span className="text-outline block">Price:</span>
                <strong className="text-primary font-bold text-sm">
                  {selectedListing.price === null || selectedListing.price === 0
                    ? 'Free / Giveaway'
                    : `₹${selectedListing.price.toLocaleString()}`}
                </strong>
              </div>
              <div>
                <span className="text-outline block">Location:</span>
                <strong className="text-primary">{selectedListing.location}</strong>
              </div>
              <div>
                <span className="text-outline block">Seller:</span>
                <strong className="text-primary">{selectedListing.postedByName}</strong>
              </div>
              <div>
                <span className="text-outline block">Quantity:</span>
                <strong className="text-primary">{selectedListing.quantity} unit(s)</strong>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-outline/10">
              <Button variant="outline" onClick={() => setSelectedListing(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                isLoading={contactingSellerId === selectedListing.id}
                onClick={() => handleContactSeller(selectedListing)}
                icon={<span className="material-symbols-outlined text-[18px]">chat</span>}
              >
                Contact Seller & Ask AI
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* CREATE LISTING MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-xl border border-outline/10 p-6 shadow-2xl bg-surface-container-lowest max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-outline/10 mb-4">
              <h3 className="font-headline-sm text-xl font-bold text-primary">
                Create Marketplace Listing
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-outline hover:text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {formValidationMsg && (
              <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">warning</span>
                <span>{formValidationMsg}</span>
              </div>
            )}

            {submitError && (
              <div className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleCreateListing} className="flex flex-col gap-4">
              <div>
                <label className="font-label-sm text-xs font-semibold text-primary block mb-1">
                  Item Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dell PowerEdge R740 Server Units (x3)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20 focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-xs font-semibold text-primary">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ListingCategory)}
                    className="py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20 focus:outline-none"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Machinery">Machinery</option>
                    <option value="Materials">Materials</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-xs font-semibold text-primary">
                    Condition *
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ListingCondition)}
                    className="py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20 focus:outline-none"
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
                  <label className="font-label-sm text-xs font-semibold text-primary">
                    Price (₹)
                  </label>
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
                    className="w-4 h-4 text-secondary rounded cursor-pointer"
                  />
                  <label htmlFor="freeItem" className="text-xs font-bold text-primary cursor-pointer">
                    🎁 Free / Giveaway (Price = Null)
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-sm text-xs font-semibold text-primary block mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="w-full py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20"
                  />
                </div>

                <div>
                  <label className="font-label-sm text-xs font-semibold text-primary block mb-1">
                    Location / City *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, KA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20"
                  />
                </div>
              </div>

              {/* Firebase Storage Image File Picker */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-xs font-semibold text-primary">
                  Upload Asset Images (Firebase Storage, Max 4 images, 5MB each)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="py-2 px-3 text-xs rounded-lg bg-surface-container-low text-on-surface border border-outline/20"
                />

                {imagePreviews.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-outline/20">
                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-0.5 right-0.5 bg-error text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Seller Notes & AI Generator */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-label-sm text-xs font-semibold text-primary">
                    Seller Notes
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    className="text-xs text-secondary font-bold hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                    <span>Generate Description with AI</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Tested RAM, redundant 750W power supply intact..."
                  value={sellerNotes}
                  onChange={(e) => setSellerNotes(e.target.value)}
                  className="py-2 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs border border-outline/20"
                />
              </div>

              <div>
                <label className="font-label-sm text-xs font-semibold text-primary block mb-1">
                  Item Description *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Provide technical specs, condition details, or pickup instructions..."
                  className="w-full py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface text-sm border border-outline/20"
                />
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                  Publish Listing to Firestore
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
