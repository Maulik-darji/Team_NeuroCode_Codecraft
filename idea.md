# CircleLoop

## Sustainability & Circular Economy Platform

CircleLoop is a full-stack sustainability and circular-economy platform connecting regular users, organizations, and sustainability services.

The platform allows users and organizations to:

* Manage unused resources
* Buy and sell reusable items
* Give away items
* Post requirements for items they need
* Discover suitable reusable items
* Get AI-powered matching
* Automate repetitive buyer/seller communication
* Monitor organizational resource consumption
* Set sustainability goals and thresholds
* Receive AI-powered consumption predictions
* Find repair and recycling options

The core principle is:

> Extend the useful life of resources before they become waste.

---

# 1. Product Users

CircleLoop has four roles:

## Regular User

Regular users can:

* Create an account
* Set their location
* Browse listings
* Search and filter listings
* Create listings
* Sell items
* Give away items
* Post requirements
* Receive matching listings
* Chat with sellers
* Ask AI questions about listings
* Request repair/recycling recommendations
* View their activity and transactions
* Manage their profile

---

## Organization Member

Organization members can:

* Access their organization's resources
* Record resource usage
* View resource dashboards
* View organizational listings
* Participate in organization resource management

Organization members cannot manage organization-level settings unless permitted.

---

## Organization Admin

Organization admins can:

* Register an organization
* Manage organization profile
* Upload verification documents
* Manage organization members
* Invite members
* Create resources
* Define monthly resource limits
* Record resource consumption
* Create sustainability goals
* Monitor resource usage
* View AI predictions
* Receive threshold alerts
* Create organization listings
* Manage surplus resources

Organizations may represent:

* Manufacturers
* Retailers
* NGOs
* Schools
* Hospitals
* Other institutions

---

## Platform Admin

Platform administrators can:

* View registered organizations
* Review organization verification requests
* Verify organizations
* Manage platform-level data
* Monitor platform activity
* Review suspicious activity
* Manage platform configuration

---

# 2. Core Platform Areas

The application should contain these major areas:

## Public Website

* Landing page
* How it works
* Sustainability information
* Marketplace preview
* Organization information
* Repair/recycling information
* Login
* Signup

## User Application

* Dashboard
* Marketplace
* Listing details
* Create listing
* My listings
* My requirements
* Requirement matches
* Conversations
* Repair & recycle
* Notifications
* Profile

## Organization Application

* Organization dashboard
* Resource management
* Resource usage
* Goals
* AI predictions
* Alerts
* Organization marketplace
* Organization members
* Organization profile

## Platform Admin

* Admin dashboard
* Organization verification
* User overview
* Platform activity
* Reports

---

# 3. Marketplace

The marketplace is based on reuse and circular economy rather than simply buying and selling.

Users and organizations can create listings.

Each listing contains:

* Title
* Description
* Category
* Condition
* Price
* Quantity
* Images
* Location
* Seller
* Status
* Tags
* Creation date
* Expiry date

Categories:

* Electronics
* Furniture
* Machinery
* Materials
* Other

Conditions:

* New
* Good
* Fair
* For Parts

A null price means the item is being given away for free.

Marketplace users should be able to:

* Search
* Filter by category
* Filter by city
* Filter by condition
* Filter by price
* Sort by newest
* View listing details
* Contact seller

---

# 4. Requirements

Users can post requirements for items they need.

Example:

"I need 5 used office chairs in Ahmedabad."

A requirement contains:

* Title
* Description
* Category
* Maximum budget
* Location
* Posted by
* Matched listings
* Status
* Creation date

Possible statuses:

* Open
* Fulfilled
* Expired

The system should automatically identify suitable listings.

AI may later improve semantic matching.

---

# 5. AI Buyer Assistant

Each listing can have an AI assistant.

The AI answers common buyer questions such as:

* Is the item still available?
* What is the condition?
* What is the price?
* How many are available?
* Where is the item located?

The AI MUST only use information available in the listing and conversation context.

The AI must never invent:

* Prices
* Quantities
* Conditions
* Specifications
* Seller promises
* Delivery information

If the question cannot be answered using available information, the AI should escalate the conversation to the seller.

AI responses should be short and useful.

---

# 6. Organization Resource Management

Organizations can define resources such as:

* Electricity
* Water
* Fuel
* Raw materials
* Equipment
* Custom resources

Each resource contains:

* Name
* Unit
* Monthly limit
* Current usage
* Last updated timestamp

Organizations can record daily usage.

Usage records contain:

* Value
* Recorded by
* Recorded date
* Optional note

The dashboard should display:

* Current usage
* Monthly limit
* Percentage consumed
* Remaining capacity
* Usage trend
* Daily usage graph

---

# 7. Sustainability Goals

Organizations can create goals.

Example:

"Reduce electricity consumption by 15% this quarter."

A goal contains:

* Resource
* Title
* Target value
* Deadline
* Status

Statuses:

* On Track
* At Risk
* Exceeded
* Achieved

AI should analyze recent usage and estimate whether the organization is likely to exceed its target.

---

# 8. AI Resource Prediction

The AI resource prediction system should:

1. Read recent usage logs.
2. Analyze usage trends.
3. Estimate end-of-period usage.
4. Calculate confidence.
5. Determine risk.
6. Recommend one specific action when necessary.
7. Generate an alert if the threshold is likely to be exceeded.

The AI response should be structured JSON.

The frontend should present the result visually rather than exposing raw JSON.

---

# 9. Repair & Recycling Assistant

Users can submit an item that they no longer want.

They provide:

* Item name
* Description
* Category
* Condition
* Optional images
* Location

AI should recommend options such as:

* Repair
* Recycle
* Donate
* Sell

The recommendation should include:

* Option type
* Title
* Description
* Search term
* Environmental benefit

Recommendations should use general service categories rather than inventing specific businesses.

For example:

"Authorised e-waste recycler"

rather than inventing a company name.

The frontend should provide a convenient map/search action using the generated search term.

---

# 10. AI Listing Description Generator

When creating a listing, users can click:

"Generate Description"

The AI receives:

* Item name
* Category
* Condition
* Price
* Quantity
* Seller notes

It generates:

* Honest description
* Relevant tags

The user MUST be able to edit the generated content before publishing.

---

# 11. Authentication

Use Firebase Authentication.

Supported methods:

* Email/password
* Google OAuth
* Optional Phone OTP

After registration, create a corresponding `/users/{uid}` document.

Roles:

* user
* org_member
* org_admin
* platform_admin

Roles should be represented through Firebase Custom Claims.

The frontend must never rely solely on client-side role checks.

Firestore Security Rules must enforce authorization.

---

# 12. Organization Verification

Organization registration requires:

* Organization name
* Organization type
* GST/CIN
* Location
* Logo
* Verification documents

New organizations are initially unverified.

A platform administrator reviews the organization.

Only after verification should the organization receive full organization privileges.

---

# 13. Firestore Collections

Use the following primary collections:

## users

`/users/{userId}`

Fields:

* uid
* displayName
* email
* photoURL
* phone
* role
* orgId
* location
* createdAt
* verified
* reputation

## organizations

`/organizations/{orgId}`

Fields:

* name
* type
* adminUid
* memberUids
* verified
* location
* logoUrl
* createdAt

Subcollections:

* resources
* goals
* alerts

## resources

`/organizations/{orgId}/resources/{resourceId}`

Fields:

* name
* unit
* monthlyLimit
* currentUsage
* updatedAt

Subcollection:

`usageLogs`

## goals

`/organizations/{orgId}/goals/{goalId}`

Fields:

* resourceId
* title
* targetValue
* deadline
* status
* aiPrediction

## listings

`/listings/{listingId}`

Fields:

* title
* description
* category
* condition
* price
* quantity
* images
* location
* postedBy
* postedByType
* status
* aiSummary
* tags
* createdAt
* expiresAt

## requirements

`/requirements/{requirementId}`

Fields:

* title
* description
* category
* maxBudget
* location
* postedBy
* matchedListings
* status
* createdAt

## conversations

`/conversations/{conversationId}`

Fields:

* listingId
* buyerUid
* sellerUid
* aiHandled
* escalated
* createdAt

Subcollection:

`messages`

Fields:

* sender
* text
* sentAt

## recycleRequests

`/recycleRequests/{requestId}`

Fields:

* userId
* itemDescription
* category
* images
* location
* aiRecommendations
* status
* createdAt

---

# 14. Technology

Frontend:

* React
* Vite
* TypeScript
* Tailwind CSS
* React Router
* React Query
* Recharts

Backend:

* Firebase
* Firestore
* Firebase Authentication
* Firebase Storage
* Firebase Cloud Functions
* Firebase Hosting
* Cloud Scheduler
* Firebase Cloud Messaging

AI:

* Anthropic Claude
* AI calls ONLY through Cloud Functions

Maps:

* Leaflet
* OpenStreetMap

---

# 15. Important Architecture Principle

Never expose the Anthropic API key in frontend code.

The architecture must be:

Frontend → Firebase Callable Function → Claude API → Firebase → Frontend

Never:

Frontend → Claude API

---

# 16. UI Direction

The website should feel like a modern sustainability technology platform.

Design characteristics:

* Clean
* Modern
* Professional
* Trustworthy
* Eco-conscious
* Premium but not overly decorative
* Responsive
* Mobile-first

Avoid:

* Generic AI-dashboard appearance
* Excessive gradients
* Excessive glassmorphism
* Overly rounded cards everywhere
* Unnecessary animations
* Stock-photo-heavy layouts
* Fake metrics
* Artificial-looking AI-generated UI

Use strong information hierarchy.

Important actions should be visually obvious.

---

# 17. Main Landing Page

Hero section should communicate:

"Give resources a second life."

Supporting message:

"CircleLoop connects people and organizations to reuse, repair, share and recycle resources before they become waste."

Primary CTA:

"Explore Marketplace"

Secondary CTA:

"For Organizations"

Then show:

1. How CircleLoop works
2. Marketplace preview
3. Organization resource monitoring
4. AI-powered sustainability
5. Repair and recycling
6. Impact statistics
7. Organization CTA
8. Footer

Do not use fake statistics.

---

# 18. Development Principle

Build incrementally.

Do NOT attempt to implement every feature at once.

Follow:

Phase 1 → Foundation
Phase 2 → Marketplace & Resources
Phase 3 → AI
Phase 4 → Security & Deployment

Before moving to the next phase:

* Run the application
* Check for errors
* Test implemented functionality
* Fix issues
* Update `memory.md`

The application must remain runnable after every phase.
