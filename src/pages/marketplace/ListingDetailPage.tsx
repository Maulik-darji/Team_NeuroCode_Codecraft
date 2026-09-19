import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { Listing } from '../../types';
import { DEMO_LISTINGS } from '../../data/demoListings';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Image Index
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Make Offer Modal State
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState<string>('');
  const [offerMessage, setOfferMessage] = useState<string>('');
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  const [isContacting, setIsContacting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Invalid Listing ID.');
      setLoading(false);
      return;
    }

    const fetchListing = async () => {
      setLoading(true);
      setError(null);

      try {
        const docRef = doc(db, 'listings', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const fetched: Listing = {
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
          };
          setListing(fetched);
          if (fetched.price) {
            setOfferAmount(Math.round(fetched.price * 0.9).toString());
          }
        } else {
          // Fallback to demo listings dataset
          const demoItem = DEMO_LISTINGS.find((l) => l.id === id);
          if (demoItem) {
            setListing(demoItem);
            if (demoItem.price) {
              setOfferAmount(Math.round(demoItem.price * 0.9).toString());
            }
          } else {
            setError('Listing not found or may have been removed.');
          }
        }
      } catch (err: any) {
        console.warn('Error fetching listing details, falling back to demo item:', err);
        const demoItem = DEMO_LISTINGS.find((l) => l.id === id);
        if (demoItem) {
          setListing(demoItem);
          if (demoItem.price) {
            setOfferAmount(Math.round(demoItem.price * 0.9).toString());
          }
        } else {
          setError('Failed to load listing details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleDeleteListing = async () => {
    if (!listing || !user || listing.postedBy !== user.uid) return;
    
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteDoc(doc(db, 'listings', listing.id));
        navigate('/marketplace');
      } catch (err) {
        console.error('Failed to delete listing:', err);
        alert('Failed to delete listing. Please try again.');
        setIsDeleting(false);
      }
    }
  };

  // Handle Initiating Direct Chat with Seller
  const handleChatWithSeller = async () => {
    if (!user) {
      alert('Please sign in to chat with the seller.');
      navigate('/login');
      return;
    }

    if (!listing) return;

    if (user.uid === listing.postedBy) {
      alert('This is your own listing.');
      return;
    }

    setIsContacting(true);

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
        lastMessage: `Hi ${listing.postedByName}, I am interested in ${listing.title}. Is it available?`,
        lastMessageAt: new Date().toISOString(),
      };

      await setDoc(convRef, convData, { merge: true });

      const msgId = `msg_${Date.now()}`;
      await setDoc(doc(db, 'conversations', convId, 'messages', msgId), {
        id: msgId,
        sender: 'buyer',
        text: `Hello ${listing.postedByName}! I am interested in your listing: "${listing.title}". Location: ${listing.location}.`,
        sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      navigate(`/conversations?id=${convId}`);
    } catch (err: any) {
      console.error('Failed to initiate chat:', err);
      alert('Could not start conversation. Please try again.');
    } finally {
      setIsContacting(false);
    }
  };

  // Handle Make Offer Submission
  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to make an offer.');
      navigate('/login');
      return;
    }

    if (!listing) return;

    if (user.uid === listing.postedBy) {
      alert('You cannot make an offer on your own listing.');
      return;
    }

    const numOffer = parseFloat(offerAmount);
    if (isNaN(numOffer) || numOffer <= 0) {
      alert('Please enter a valid offer amount.');
      return;
    }

    setIsSubmittingOffer(true);

    try {
      const convId = `conv_${listing.id}_${user.uid}`;
      const convRef = doc(db, 'conversations', convId);

      const offerText = `OFFER SUBMITTED: ₹${numOffer.toLocaleString()}.\nMessage: "${
        offerMessage.trim() || 'I would like to make a formal price offer for this item.'
      }"`;

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
        lastMessage: `Offer Proposed: ₹${numOffer.toLocaleString()}`,
        lastMessageAt: new Date().toISOString(),
      };

      await setDoc(convRef, convData, { merge: true });

      const msgId = `msg_${Date.now()}`;
      await setDoc(doc(db, 'conversations', convId, 'messages', msgId), {
        id: msgId,
        sender: 'buyer',
        text: offerText,
        sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      setShowOfferModal(false);
      navigate(`/conversations?id=${convId}`);
    } catch (err: any) {
      console.error('Failed to submit offer:', err);
      alert('Could not send offer. Please try again.');
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div className="pt-28 pb-16 max-w-[1200px] mx-auto px-4 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-on-surface-variant animate-pulse">
          Loading listing details...
        </p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="pt-28 pb-16 max-w-[1200px] mx-auto px-4 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-error/10 text-error flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">error</span>
        </div>
        <h2 className="font-display-hero text-2xl font-bold text-primary mb-2">
          {error || 'Listing Not Found'}
        </h2>
        <Button variant="primary" onClick={() => navigate('/marketplace')}>
          Back to Marketplace
        </Button>
      </div>
    );
  }

  const isOwner = user && user.uid === listing.postedBy;
  const formattedDate = new Date(listing.createdAt)
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })
    .toUpperCase();

  return (
    <div className="pt-24 pb-16 max-w-[1280px] mx-auto px-4 md:px-margin">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <nav className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
          <Link to="/marketplace" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            Marketplace
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-secondary font-semibold">{listing.category}</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="truncate max-w-[220px] text-on-surface font-semibold">{listing.title}</span>
        </nav>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/marketplace')}
          icon={<span className="material-symbols-outlined text-[16px]">arrow_back</span>}
        >
          Back to Marketplace
        </Button>
      </div>

      {/* Main Page Layout Grid (Matches User Reference Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Main Image Showcase */}
          <Card className="p-0 overflow-hidden border border-outline/10 bg-surface shadow-xs">
            <div className="relative w-full h-[360px] sm:h-[420px] bg-surface-container-high flex items-center justify-center">
              {listing.images.length > 0 ? (
                <img
                  src={listing.images[activeImageIndex] || listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <span className="material-symbols-outlined text-[64px] text-primary/30 mb-2">
                    category
                  </span>
                  <span className="font-headline-sm text-base font-bold text-primary">
                    {listing.category}
                  </span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {listing.images.length > 1 && (
              <div className="p-3 bg-surface-container-lowest border-t border-outline/10 flex items-center gap-2 overflow-x-auto">
                {listing.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIndex === idx ? 'border-secondary scale-105' : 'border-outline/20 opacity-70'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Top Title & Specs Header Card */}
          <Card className="p-6 border border-outline/10 bg-surface">
            <div className="mb-2">
              <span className="px-2.5 py-0.5 rounded font-label-sm text-[10px] font-bold tracking-wider uppercase bg-amber-400 text-amber-950 inline-block mb-2">
                FEATURED
              </span>
              <h1 className="font-display-hero text-2xl sm:text-3xl font-bold text-primary leading-tight">
                {listing.title}
              </h1>
              <p className="text-xs text-on-surface-variant font-mono mt-1">
                Category: {listing.category} • Condition: {listing.condition}
              </p>
            </div>

            {/* Quick Param Icons Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-outline/10 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">inventory_2</span>
                Qty: {listing.quantity} Unit(s)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                {listing.condition} Condition
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                {listing.city || listing.location}
              </span>
            </div>
          </Card>

          {/* Overview Section Card */}
          <Card className="p-6 border border-outline/10 bg-surface">
            <h2 className="font-headline-sm text-lg font-bold text-primary mb-4 pb-2 border-b border-outline/10">
              Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">person_check</span>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-on-surface-variant block">Condition</span>
                  <strong className="font-headline-sm text-sm font-bold text-primary">{listing.condition}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">location_on</span>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-on-surface-variant block">Location</span>
                  <strong className="font-headline-sm text-sm font-bold text-primary">{listing.location}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">calendar_today</span>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-on-surface-variant block">Posting date</span>
                  <strong className="font-headline-sm text-sm font-bold text-primary">{formattedDate}</strong>
                </div>
              </div>
            </div>
          </Card>

          {/* Description Section Card */}
          <Card className="p-6 border border-outline/10 bg-surface">
            <h2 className="font-headline-sm text-lg font-bold text-primary mb-3 pb-2 border-b border-outline/10">
              Description
            </h2>
            <div className="font-body-md text-sm text-on-surface-variant whitespace-pre-line leading-relaxed">
              {listing.description}
            </div>
          </Card>
        </div>

        {/* Right Column (5 Cols - Matching User Reference Screenshot) */}
        <div className="lg:col-span-5 flex flex-col gap-5 sticky top-24">
          {/* Card 1: Price Tag & Make Offer Button */}
          <Card className="p-6 border border-outline/10 bg-surface shadow-xs">
            <div className="mb-4">
              {listing.price === null || listing.price === 0 ? (
                <div className="flex items-baseline gap-2">
                  <span className="font-display-hero text-3xl sm:text-4xl font-extrabold text-secondary">
                    ₹0
                  </span>
                  <Badge variant="free">FREE GIVEAWAY</Badge>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="font-display-hero text-3xl sm:text-4xl font-extrabold text-primary">
                    ₹ {listing.price.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Primary Action Button: MAKE OFFER */}
            {isOwner ? (
              <div className="flex flex-col gap-3">
                <div className="p-3 rounded-xl bg-secondary-fixed/40 text-on-secondary-fixed-variant text-center text-xs font-bold flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  YOUR OWN ACTIVE LISTING
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-error text-error hover:bg-error/10 font-bold"
                  onClick={handleDeleteListing}
                  isLoading={isDeleting}
                  icon={<span className="material-symbols-outlined text-[18px]">delete</span>}
                >
                  Delete Listing
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  if (!user) {
                    alert('Please sign in to make an offer.');
                    navigate('/login');
                    return;
                  }
                  setShowOfferModal(true);
                }}
                className="w-full font-bold text-base py-3.5 bg-[#004797] hover:bg-[#003470] text-white rounded-lg shadow-sm"
              >
                Make offer
              </Button>
            )}
          </Card>

          {/* Card 2: Posted By Seller Card & Chat With Seller Button */}
          <Card className="p-6 border border-outline/10 bg-surface shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-xl">
                  <span className="material-symbols-outlined text-[28px]">account_circle</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block">Posted By</span>
                  <h4 className="font-headline-sm text-base font-bold text-primary leading-tight">
                    {isOwner ? 'You (Owner)' : listing.postedByName || 'Verified Seller'}
                  </h4>
                  <span className="text-[11px] text-on-surface-variant">Member since 2026</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[20px]">chevron_right</span>
            </div>

            <div className="py-2 mb-4 border-t border-b border-outline/10 flex items-center justify-around text-center text-xs">
              <div>
                <strong className="font-bold text-primary block text-sm">1</strong>
                <span className="text-on-surface-variant text-[11px]">Items listed</span>
              </div>
            </div>

            {/* Secondary Action: Chat with Seller */}
            {!isOwner && (
              <Button
                variant="outline"
                size="md"
                isLoading={isContacting}
                onClick={handleChatWithSeller}
                className="w-full border-[#004797] text-[#004797] hover:bg-[#004797]/10 font-bold py-2.5 rounded-lg"
              >
                Chat with seller
              </Button>
            )}
          </Card>

          {/* Card 3: Sell For Free Promotion Box (Matches Screenshot) */}
          <Card className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white border border-blue-200 text-[#004797] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">add</span>
              </div>
              <span className="font-headline-sm text-xs font-bold text-primary">
                Have a similar Item?
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/marketplace')}
              className="border-[#004797] text-[#004797] font-bold text-xs px-3 py-1.5 rounded-lg"
            >
              Sell For Free
            </Button>
          </Card>

          {/* Share Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            icon={
              <span className="material-symbols-outlined text-[16px]">
                {copiedLink ? 'check' : 'share'}
              </span>
            }
            className="w-full"
          >
            {copiedLink ? 'Link Copied!' : 'Share Listing'}
          </Button>
        </div>
      </div>

      {/* MAKE OFFER MODAL DIALOG */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-lg border border-outline/10 p-6 shadow-2xl bg-surface-container-lowest">
            <div className="flex items-center justify-between pb-3 border-b border-outline/10 mb-4">
              <h3 className="font-headline-sm text-xl font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[24px]">gavel</span>
                Make an Offer to Seller
              </h3>
              <button
                type="button"
                onClick={() => setShowOfferModal(false)}
                className="text-outline hover:text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitOffer} className="space-y-4">
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline/10">
                <span className="text-xs text-on-surface-variant block">Listing:</span>
                <strong className="text-sm font-bold text-primary">{listing.title}</strong>
                <div className="text-xs text-secondary font-semibold mt-1">
                  Listed Price: ₹{listing.price ? listing.price.toLocaleString() : '0 (Free)'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Your Price Offer (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-primary text-sm">₹</span>
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="Enter offer amount..."
                    required
                    min="1"
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-surface-container-low text-on-surface border border-outline/20 font-bold focus:outline-none focus:border-secondary"
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Suggest a reasonable price to negotiate directly with {listing.postedByName}.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Message for Seller (Optional)
                </label>
                <textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="e.g., Hi, I am ready to purchase immediately at this price..."
                  rows={3}
                  className="w-full p-3 text-xs rounded-lg bg-surface-container-low text-on-surface border border-outline/20 focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-outline/10">
                <Button variant="outline" type="button" onClick={() => setShowOfferModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  isLoading={isSubmittingOffer}
                  className="bg-[#004797] hover:bg-[#003470] text-white font-bold"
                >
                  Send Offer to Seller
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ListingDetailPage;
