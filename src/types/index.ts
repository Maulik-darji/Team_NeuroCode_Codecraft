export type UserRole = 'user' | 'org_member' | 'org_admin' | 'platform_admin';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  phone?: string;
  role: UserRole;
  orgId?: string;
  location?: string;
  verified?: boolean;
  reputation?: number;
  createdAt: string;
}

export interface Organization {
  orgId: string;
  name: string;
  type: string;
  adminUid: string;
  memberUids: string[];
  verified: boolean;
  location: string;
  logoUrl?: string;
  gstCin?: string;
  verificationDocUrl?: string;
  createdAt: string;
}

export type ListingCategory = 'Electronics' | 'Furniture' | 'Machinery' | 'Materials' | 'Other';
export type ListingCondition = 'New' | 'Good' | 'Fair' | 'For Parts';
export type ListingStatus = 'Available' | 'Reserved' | 'Completed' | 'Expired';

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: ListingCategory;
  condition: ListingCondition;
  price: number | null; // null = Free / Give Away
  quantity: number;
  images: string[];
  location: string;
  city?: string;
  postedBy: string; // sellerId uid
  postedByName?: string;
  postedByType: 'user' | 'organization';
  status: ListingStatus;
  aiSummary?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string;
}

export type RequirementStatus = 'Open' | 'Fulfilled' | 'Expired';

export interface Requirement {
  id: string;
  title: string;
  description: string;
  category: ListingCategory;
  maxBudget?: number;
  location: string;
  postedBy: string;
  postedByName?: string;
  matchedListings: string[]; // listing IDs
  status: RequirementStatus;
  createdAt: string;
}

export interface Resource {
  id: string;
  orgId: string;
  name: string;
  unit: string;
  monthlyLimit: number;
  currentUsage: number;
  updatedAt: string;
}

export interface UsageLog {
  id: string;
  resourceId: string;
  value: number;
  recordedBy: string;
  recordedDate: string;
  note?: string;
}

export type GoalStatus = 'on_track' | 'at_risk' | 'exceeded' | 'achieved';

export interface Goal {
  id: string;
  orgId: string;
  resourceId: string;
  resourceName?: string;
  title: string;
  targetValue: number;
  deadline: string;
  status: GoalStatus;
  aiPrediction?: {
    predictedValue: number;
    confidence: number;
    riskLevel: 'low' | 'medium' | 'high';
    recommendation: string;
  };
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle?: string;
  buyerUid: string;
  sellerUid: string;
  aiHandled: boolean;
  escalated: boolean;
  createdAt: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface Message {
  id: string;
  sender: string; // 'buyer' | 'seller' | 'ai'
  senderId?: string;
  text: string;
  sentAt: string;
}

export interface RecycleRequest {
  id: string;
  userId: string;
  itemName: string;
  itemDescription: string;
  category: ListingCategory;
  condition: ListingCondition;
  location: string;
  images?: string[];
  aiRecommendations?: {
    optionType: 'Repair' | 'Recycle' | 'Donate' | 'Sell';
    title: string;
    description: string;
    searchTerm: string;
    environmentalBenefit: string;
  }[];
  status: 'Pending' | 'Processed';
  createdAt: string;
}
