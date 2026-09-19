# CircleLoop Development Restrictions

These rules are mandatory.

---

## 1. Read Project Documentation First

Before making changes, always read:

* `idea.md`
* `restrictions.md`
* `memory.md`

Do not start implementation without understanding the current project state.

---

# 2. Do Not Rewrite Existing Features

If a feature already works:

* Do not rewrite it unnecessarily.
* Do not replace its architecture.
* Do not change working components just for stylistic reasons.
* Do not remove working functionality.

Modify only what is necessary.

---

# 3. Preserve Existing Technology

Do not switch frameworks or major technologies without explicit approval.

Current stack:

* React
* Vite
* TypeScript
* Tailwind CSS
* Firebase
* Firestore
* Firebase Auth
* Firebase Storage
* Cloud Functions
* Claude API
* Recharts
* Leaflet
* OpenStreetMap

Do not replace Firebase with Supabase, MongoDB, PostgreSQL, etc. unless explicitly requested.

Do not replace React with Vue/Next.js unless explicitly requested.

Do not touch or modify the `.gradle` folder under any circumstances.

---

# 4. AI Security

NEVER expose:

* Anthropic API keys
* Firebase Admin credentials
* Service account credentials
* private secrets

inside:

* React components
* frontend JavaScript
* `.env` variables exposed with `VITE_`
* public files
* Git repository

Claude API calls must happen inside Cloud Functions.

---

# 5. Environment Variables

Never hardcode secrets.

Use environment variables or Firebase-supported server-side configuration.

Never commit `.env` files containing secrets.

Ensure `.gitignore` protects sensitive files.

---

# 6. Firestore Security

Never assume frontend authorization is sufficient.

Every sensitive Firestore operation must be protected using Firestore Security Rules.

Organization data must be isolated.

Organization A must never be able to access Organization B's private resources.

Use:

* Firebase Custom Claims
* role checks
* orgId checks
* ownership checks

---

# 7. Role Security

Valid roles:

* user
* org_member
* org_admin
* platform_admin

Never create arbitrary roles without updating:

* TypeScript types
* authentication logic
* frontend routing
* Cloud Functions
* Firestore Security Rules

---

# 8. AI Reliability

Never allow AI to invent factual information.

For marketplace Q&A:

AI can only answer from:

* listing information
* conversation context

For repair/recycling recommendations:

AI should provide general categories and search terms.

Do not fabricate:

* business names
* addresses
* phone numbers
* prices
* product specifications
* certifications

---

# 9. AI Output Validation

Never directly trust AI-generated JSON.

Validate AI responses before writing them to Firestore.

Handle:

* malformed JSON
* missing fields
* unexpected values
* API errors
* timeout
* rate limits

The application must fail gracefully.

---

# 10. User Control Over AI

AI-generated listing descriptions must remain editable.

AI recommendations should be presented as recommendations, not absolute facts.

AI predictions should clearly indicate uncertainty/confidence.

---

# 11. No Fake Data in Production UI

Do not create fake:

* user counts
* sustainability statistics
* organization counts
* environmental savings
* transaction numbers
* AI accuracy percentages

Demo seed data is allowed only when explicitly identified as demo data.

---

# 12. Responsive Design

Every frontend page must work on:

* Mobile
* Tablet
* Laptop
* Desktop

Do not design desktop-only interfaces.

---

# 13. Accessibility

Use:

* semantic HTML
* proper labels
* keyboard-accessible controls
* visible focus states
* sufficient contrast
* descriptive button labels
* alt text for meaningful images

Do not use icons as the only indication of important actions.

---

# 14. Loading & Error States

Every asynchronous operation must have appropriate:

* loading state
* success state
* error state
* empty state

Never leave the user staring at a blank screen.

---

# 15. Forms

Forms must:

* validate input
* show useful errors
* prevent duplicate submissions
* show loading state
* handle Firebase errors gracefully

Never silently fail.

---

# 16. Images

Listing images must be uploaded to Firebase Storage.

Do not store large image binaries directly in Firestore.

Store Storage URLs in Firestore.

Validate:

* file type
* file size
* upload errors

---

# 17. Firestore Efficiency

Avoid unnecessary reads.

Use:

* pagination
* appropriate queries
* React Query caching
* realtime listeners only where necessary

Do not continuously listen to large collections unnecessarily.

---

# 18. Components

Prefer reusable components.

Examples:

* Button
* Input
* Modal
* Card
* Badge
* EmptyState
* LoadingState
* ErrorState
* ListingCard
* ResourceProgress
* GoalCard

Avoid giant components containing hundreds of lines when functionality can be separated cleanly.

---

# 19. Routing

Use role-aware protected routes.

Users should not be able to access organization/admin pages simply by typing the URL.

Frontend protection is required for UX.

Backend/Firestore protection is required for actual security.

---

# 20. Database Schema

Do not casually change the Firestore schema.

If a schema change becomes necessary:

1. Explain why.
2. Update `idea.md`.
3. Update relevant TypeScript types.
4. Update security rules.
5. Update affected functions.
6. Update `memory.md`.

---

# 21. Dependencies

Do not install a new npm package unless necessary.

Before adding a package:

* Check whether existing dependencies can solve the problem.
* Prefer lightweight dependencies.
* Avoid duplicate libraries.

---

# 22. Styling

Maintain a consistent design system.

Do not randomly introduce:

* new colors
* new fonts
* unrelated component styles
* inconsistent border radii
* inconsistent spacing

---

# 23. Animations

Animations should improve UX.

Avoid excessive:

* parallax
* particle effects
* bouncing elements
* auto-playing animations
* distracting transitions

Prefer subtle motion.

---

# 24. No Unrequested Features

Do not implement unrelated features simply because they seem useful.

Examples:

* payment gateway
* cryptocurrency
* social network
* complex logistics
* carbon-credit marketplace
* unnecessary gamification

These may be future features but are not part of the current MVP.

---

# 25. Never Delete User Data During Development

Do not automatically:

* clear Firestore
* delete Firebase Storage
* reset authentication
* overwrite production data

without explicit approval.

---

# 26. Error Handling

Never hide errors with empty catch blocks.

Bad:

```typescript
try {
  // ...
} catch {
}
```

Instead:

* log the error appropriately
* show a useful user message
* preserve application stability

---

# 27. Before Completing Any Task

Always verify:

1. TypeScript compiles.
2. Build succeeds.
3. No obvious console errors.
4. Existing functionality still works.
5. Security implications are considered.
6. `memory.md` is updated.

---

# 28. Documentation Rule

When a significant architectural or product decision is made:

Update `memory.md`.

Do not store temporary debugging information unless it will matter later.

---

# 29. Coding Agent Behavior

When asked to implement something:

1. Read documentation.
2. Inspect the existing code.
3. Identify affected files.
4. Explain the implementation plan briefly.
5. Make minimal targeted changes.
6. Test the result.
7. Fix errors.
8. Update `memory.md`.
9. Report exactly what changed.

Do not blindly generate an entirely new project over an existing codebase.
