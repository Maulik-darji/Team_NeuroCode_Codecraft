# RELOOP Organization Module - Integration Contract & Developer Guide

This document outlines the architecture, package structure, API contracts, and integration points for the **Organization Module** of RELOOP.

---

## 1. Organization Package Structure

All code for this module is isolated under package `com.reloop.organization`:

```
com.reloop.organization
├── model/                     # Domain DTOs
│   ├── OrgSummary.java
│   ├── TrackedResource.java
│   ├── HistoricalConsumption.java
│   ├── ResourceGoal.java
│   ├── ForecastResult.java
│   ├── AIRecommendation.java
│   ├── OrgAlert.java
│   ├── SustainabilityMetrics.java
│   └── OrgProfile.java
├── contracts/                 # Inter-module Contracts
│   ├── AIServiceContract.java
│   ├── MarketplaceNavigationContract.java
│   ├── UserRepositoryContract.java
│   └── GlobalNavigationContract.java
├── mock/                      # Replaceable Mock Data
│   └── OrganizationMockData.java
├── repository/                # Data Repositories
│   ├── OrganizationRepository.java
│   ├── ResourceRepository.java
│   ├── ForecastRepository.java
│   ├── GoalRepository.java
│   └── AlertRepository.java
├── view/                      # Custom Graphics & Views
│   └── SimpleBarChartView.java
├── dashboard/                 # 1. Organization Dashboard Screen
│   ├── OrganizationDashboardActivity.java
│   └── OrganizationDashboardViewModel.java
├── resource/                  # 2, 3, 4. Resource Management, Detail & History Screens
│   ├── ResourceManagementActivity.java
│   ├── ResourceManagementViewModel.java
│   ├── ResourceDetailActivity.java
│   ├── ResourceDetailViewModel.java
│   ├── ResourceAdapter.java
│   ├── ConsumptionHistoryActivity.java
│   ├── ConsumptionHistoryViewModel.java
│   └── ConsumptionAdapter.java
├── goals/                     # 5. Goal / Threshold Management Screen
│   ├── TargetThresholdActivity.java
│   └── TargetThresholdViewModel.java
├── forecast/                  # 6. AI Forecast Screen
│   ├── AIForecastActivity.java
│   └── AIForecastViewModel.java
├── recommendation/            # 7. AI Recommendation Screen
│   ├── AIRecommendationActivity.java
│   ├── AIRecommendationViewModel.java
│   └── RecommendationAdapter.java
├── alerts/                    # 8. Organization Alerts Screen
│   ├── OrganizationAlertsActivity.java
│   ├── OrganizationAlertsViewModel.java
│   └── AlertsAdapter.java
├── sustainability/            # 9. Sustainability Overview Screen
│   ├── SustainabilityOverviewActivity.java
│   └── SustainabilityViewModel.java
├── firebase/                  # 14. Firebase Firestore & Storage Repositories
│   ├── FirebaseOrgManager.java
│   ├── FirebaseResourceRepository.java
│   ├── FirebaseEnquiryRepository.java
│   └── FirebaseListingRepository.java
├── mock/                      # Replaceable Mock & Reset Data
│   └── DataResetManager.java
├── enquiries/                 # 13. Activity & Enquiries Screen (Screen 5)
│   ├── OrganizationEnquiriesActivity.java
│   ├── OrganizationEnquiriesViewModel.java
│   ├── OrganizationEnquiriesRepository.java
│   ├── OrganizationEnquiriesMockData.java
│   ├── EnquiriesAdapter.java
│   └── OrgEnquiry.java
└── profile/                   # 10. Organization Profile Screen
    ├── OrganizationProfileActivity.java
    └── OrganizationProfileViewModel.java
```

---

## 2. Firebase Integration & Storage (`com.reloop.organization.firebase`)

The Organization module includes a Firebase Firestore and Storage integration layer:

- **Root Document Path**: `organizations/{orgId}` (default `shivalik_textiles_01`).
- **Collections**:
  - `organizations/{orgId}/resources`: Tracked resource limits, targets, and actual consumption.
  - `organizations/{orgId}/enquiries`: Marketplace enquiries, buyer offers, and negotiation statuses.
  - `organizations/{orgId}/listings`: Surplus asset listings published from the app.
- **Firebase Storage**: Asset images uploaded during surplus listing creation are stored under `organizations/{orgId}/assets/{listingId}_{timestamp}.jpg`.
- **Safe Fallback**: If `google-services.json` or internet is unavailable, `FirebaseOrgManager` operates gracefully in offline/clean-slate mode without crashing.

---

## 3. Data Reset & Clean Slate Mode

- **DataResetManager**: Utility in `com.reloop.organization.mock` allowing complete dataset resets so you can enter custom data directly via the UI or Firebase.
- **Empty State Polish**: All data-driven screens handle zero-item states cleanly with user-friendly empty state cards and prompt triggers.

---

## 2. Screens Implemented (13 Total)

1. `OrganizationDashboardActivity`: Main entry dashboard for organizations.
2. `ResourceManagementActivity`: Resource management list screen with target markers & status counters.
3. `ResourceDetailActivity`: Detailed view of a single resource showing target vs actual grid, AI prediction, gauge markers, and 6-month historical chart.
4. `ConsumptionHistoryActivity`: Full daily/weekly/monthly historical consumption logs with variance percentages.
5. `TargetThresholdActivity`: Target, maximum threshold (hard cap), unit, location, and alert configuration.
6. `AIForecastActivity`: Full predictive forecast details, current vs predicted usage, risk badge, and trend projection.
7. `AIRecommendationActivity`: AI-recommended optimization actions with "Apply / Track Action" triggers.
8. `OrganizationAlertsActivity`: Critical predicted breach alerts, threshold crossing notifications, and historical alert log.
9. `SustainabilityOverviewActivity`: 100-point sustainability index score, pillar sub-scores, and environmental/financial savings stats.
10. `OrganizationProfileActivity`: Verified corporate profile, unit details, contact info, and management shortcuts.
11. `OrganizationSurplusMarketplaceActivity`: Surplus asset catalog browsing, categories grid, location filter, and search.
12. `OrganizationListAssetActivity`: Sectioned form for listing unused organization assets.
13. `OrganizationEnquiriesActivity`: Activity & Enquiries hub with sub-tabs (`NEW (4)`, `IN TALKS`, `COMPLETED`) and `Decline` / `Respond` action handlers.

---

## 3. Navigation Destinations

To launch any Organization screen from another module:

```java
// Launch Organization Dashboard
Intent intent = new Intent(context, com.reloop.organization.dashboard.OrganizationDashboardActivity.class);
context.startActivity(intent);

// Launch Resource Details for a specific resource ID
Intent intent = new Intent(context, com.reloop.organization.resource.ResourceDetailActivity.class);
intent.putExtra("EXTRA_RESOURCE_ID", "res_1");
context.startActivity(intent);
```

---

## 4. Repository Interfaces & Contracts

The Organization module defines contract interfaces in `com.reloop.organization.contracts`:

- `AIServiceContract`: Defines `getForecastForResource(String)`, `getRecommendationsForResource(String)`, `applyRecommendation(String)`.
- `MarketplaceNavigationContract`: Defines `openBulkMarketplace(Context)`, `openSurplusListings(Context)`, etc.
- `UserRepositoryContract`: Exposes user session data without touching Auth code.
- `GlobalNavigationContract`: Handles switching between `ORGANIZATION`, `REGULAR`, and `RRR` modes.

---

## 5. Expected Backend API Endpoints

When backend integration is ready, replace `OrganizationMockData` inside the Repositories with network calls matching:

- `GET /api/v1/organization/dashboard`
- `GET /api/v1/organization/resources`
- `GET /api/v1/organization/resources/{id}`
- `GET /api/v1/organization/resources/{id}/history`
- `POST /api/v1/organization/goals`
- `GET /api/v1/organization/alerts`

---

## 6. AI Data Contract

The AI team can connect their prediction model by supplying JSON structured as follows:

```json
{
    "resourceType": "Electricity",
    "currentUsage": 82000,
    "predictedUsage": 108400,
    "threshold": 100000,
    "riskLevel": "HIGH",
    "predictionDate": "2026-09-30",
    "recommendation": "Shift 2 carding lines to off-peak",
    "lastUpdated": "Updated 08:40"
}
```

The `ForecastRepository` implements `AIServiceContract` and can directly consume the AI team's API response without changing the Android UI.

---

## 7. Exposed Models

All DTOs reside in `com.reloop.organization.model`:
`OrgSummary`, `TrackedResource`, `HistoricalConsumption`, `ResourceGoal`, `ForecastResult`, `AIRecommendation`, `OrgAlert`, `SustainabilityMetrics`, `OrgProfile`.

---

## 8. Shared Resources Modified

Only non-conflicting resources were added:
- `res/values/colors.xml`: Added prefixed tokens (`org_primary_forest`, `org_bg_warm`, `org_surface_white`, `org_text_charcoal`, `org_text_muted`, `org_border_muted`, `org_warning_amber`, `org_critical_red`, `org_success_forest`).
- `res/values/strings.xml`: Added prefixed string resources (`org_*`).
- `AndroidManifest.xml`: Declared Organization module Activities.

---

## 9. Files Other Teams Should NOT Modify

To prevent multi-developer merge conflicts, other teams should NOT modify:
- Any file under `src/main/java/com/reloop/organization/`
- Any layout starting with `activity_organization_*`, `activity_resource_*`, `activity_target_*`, `activity_ai_*`, `activity_sustainability_*`, `item_org_*`
- Any drawable starting with `bg_org_*` or `ic_org_*`

---

## 10. How to Connect Organization Module to Global Navigation

To wire up the main app navigation bar or top switcher to the Organization module:

```java
// In main navigation bar listener:
if (selectedTab == TAB_ORGANIZATION) {
    Intent intent = new Intent(context, OrganizationDashboardActivity.class);
    context.startActivity(intent);
}
```

---

## 11. How the AI Team Can Replace Mock Data

1. Implement `AIServiceContract` inside your package (or update `ForecastRepository`).
2. Map your API response DTO into `ForecastResult` and `List<AIRecommendation>`.
3. Call `ForecastRepository.setAIService(yourServiceImplementation)`.

---

## 12. How the Marketplace Team Can Connect Its Screens

1. Implement `MarketplaceNavigationContract`.
2. Override `openBulkMarketplace(Context context)` to launch your `MarketplaceMainActivity`.
3. Pass your implementation to `OrganizationDashboardActivity`.
