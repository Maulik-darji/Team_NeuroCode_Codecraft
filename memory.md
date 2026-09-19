# CircleLoop Project Memory

## Project

Name: CircleLoop

Purpose:

Sustainability and circular-economy platform for individuals and organizations.

Core concept:

Reuse → Repair → Donate → Sell → Recycle

---

# Current Development Status

Current Phase:

Phase 2 — Core Platform (Marketplace, Requirements & Resource Management)

Current Task:

Implementing full Marketplace browsing, listing creation with image uploads, requirement posting with deterministic matching, and resource logging.

Completed:

* Product idea documented (`idea.md`)
* Engineering restrictions documented (`restrictions.md`)
* Initial project memory established (`memory.md`)
* Stitch design system assets retrieved & extracted (`stitch_assets/`)
* React + Vite + TypeScript + Tailwind CSS application initialized & built cleanly
* Stitch UI design tokens & reusable component architecture (`Button`, `Input`, `Card`, `Badge`, `ResourceProgress`)
* Public Landing page with all 8 Stitch sections (Hero circular flow card, How It Works, Live Marketplace preview, Institutional Resource Monitoring, AI Sustainability, Repair & Recycling)
* Firebase configuration & AuthContext
* ProtectedRoute & RoleProtectedRoute for RBAC (`user`, `org_member`, `org_admin`, `platform_admin`)
* Authentication pages (Sign In, Sign Up with role selection)
* User Dashboard, Organization Registration, Organization Dashboard, and Platform Admin Verification Console


---

# Technology Decisions

Frontend:

* React 18
* Vite
* TypeScript
* Tailwind CSS
* React Router v6
* Lucide React / Material Symbols
* Recharts

Backend:

* Firebase (v10+)
* Firestore
* Firebase Authentication
* Firebase Storage
* Firebase Cloud Functions (Node.js 20 runtime)
* Firebase Hosting

AI:

* Anthropic Claude API
* Called ONLY from Firebase Cloud Functions (server-side)

Design System:

* Extracted from Google Stitch design exports (`stitch_assets/`)
* Space Grotesk (Headings), Hanken Grotesk (Body), JetBrains Mono (Labels/Monospace)
* Colors: Primary `#012d1d`, Secondary `#006c48`, Secondary-container `#92f7c3`, Surface `#f9f9ff`

---

# User Roles

1. `user` — Regular user
2. `org_member` — Organization member
3. `org_admin` — Organization administrator
4. `platform_admin` — Platform administrator

---

# Security Decisions

Authentication:

Firebase Authentication (Email/Password, Google OAuth).

Authorization:

Firebase Custom Claims + Firestore Security Rules.

Organization isolation:

Every organization resource operation must verify `orgId`.

AI API key:

Never exposed to browser. Kept inside Cloud Functions environment secrets.

Secrets:

Never commit secrets to Git.

---

# Firestore Collections

* `/users`
* `/organizations`
* `/organizations/{orgId}/resources`
* `/organizations/{orgId}/resources/{resourceId}/usageLogs`
* `/organizations/{orgId}/goals`
* `/organizations/{orgId}/alerts`
* `/listings`
* `/requirements`
* `/conversations`
* `/conversations/{conversationId}/messages`
* `/recycleRequests`

---

# AI Features

## 1. Buyer Q&A Assistant

Status: Not implemented.

Purpose: Answer common listing questions automatically based strictly on available listing context.

---

## 2. Resource Threshold Prediction

Status: Not implemented.

Purpose: Predict whether organizational resource consumption may exceed defined limits.

---

## 3. Repair & Recycling Recommendations

Status: Not implemented.

Purpose: Recommend repair, recycle, donate, or sell options with search term actions.

---

## 4. Listing Description Generator

Status: Not implemented.

Purpose: Generate editable listing descriptions and tags from seller notes.

---

# Product Design

Visual direction:

* Extracted from Google Stitch export
* Modern
* Clean
* Sustainable (Emerald / Dark Teal / Slate accents)
* Professional
* Trustworthy
* Responsive & mobile-first

---

# Development Phases

## Phase 1 (In Progress)

Foundation:

* Project scaffold (React + Vite + TS + Tailwind)
* Stitch design system integration
* Public landing page & section previews
* Firebase initialization
* Authentication & RBAC routes
* Organization registration & verification interface

## Phase 2

Core platform:

* Marketplace (Browse, Search, Filters, Free/Giveaway)
* Requirements & deterministic matching
* Conversations & messaging
* Resource management & Recharts dashboard

## Phase 3

AI:

* Buyer Q&A Callable Function
* Resource prediction Callable Function
* Repair/recycling recommender Callable Function
* Listing description generator Callable Function

## Phase 4

Production:

* Security hardening (Firestore rules, RBAC)
* App Check & Notifications
* Hosting setup & Demo data walkthrough

---

# Last Updated

Phase 0 completed. Phase 1 Web app initialization underway.
