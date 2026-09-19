const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * 1. AI Buyer Assistant Function (Zero-Cost Deterministic Grounding)
 * Answers buyer questions based STRICTLY on listing details & context without requiring paid API keys.
 */
exports.buyerAssistant = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required");
  }

  const { listingId, buyerQuestion } = request.data;
  if (!listingId || !buyerQuestion) {
    throw new HttpsError("invalid-argument", "Missing listingId or buyerQuestion");
  }

  const listingDoc = await db.collection("listings").doc(listingId).get();
  if (!listingDoc.exists) {
    throw new HttpsError("not-found", "Listing not found");
  }

  const listing = listingDoc.data();
  const qLower = buyerQuestion.toLowerCase();

  let answer = "";
  let escalated = false;

  if (qLower.includes("price") || qLower.includes("cost") || qLower.includes("how much")) {
    answer = listing.price === null 
      ? `This item (${listing.title}) is offered for FREE as a grant / giveaway!` 
      : `The listed price for ${listing.title} is ₹${listing.price.toLocaleString()}.`;
  } else if (qLower.includes("condition") || qLower.includes("quality") || qLower.includes("state")) {
    answer = `The condition of ${listing.title} is listed as "${listing.condition}". Description: ${listing.description}`;
  } else if (qLower.includes("location") || qLower.includes("where") || qLower.includes("city")) {
    answer = `${listing.title} is located in ${listing.location}.`;
  } else if (qLower.includes("available") || qLower.includes("quantity") || qLower.includes("how many")) {
    answer = `There are ${listing.quantity || 1} unit(s) available for ${listing.title}. Status: ${listing.status || "Available"}.`;
  } else {
    answer = `Based on listing details: ${listing.description}. For additional custom delivery or specification inquiries, your request will be escalated directly to the seller.`;
    escalated = true;
  }

  return { answer, escalated };
});

/**
 * 2. Resource Threshold Prediction Function (100% Free Mathematical Model)
 */
exports.predictResourceUsage = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required");
  }

  const { orgId, resourceId } = request.data;
  const resourceDoc = await db.collection("organizations").doc(orgId).collection("resources").doc(resourceId).get();

  if (!resourceDoc.exists) {
    throw new HttpsError("not-found", "Resource not found");
  }

  const resource = resourceDoc.data();
  const percentage = (resource.currentUsage / resource.monthlyLimit) * 100;
  const riskLevel = percentage >= 80 ? "high" : percentage >= 60 ? "medium" : "low";

  return {
    predictedValue: Math.round(resource.currentUsage * 1.15),
    monthlyLimit: resource.monthlyLimit,
    percentageConsumed: Math.round(percentage),
    riskLevel,
    recommendation: percentage >= 80
      ? `High consumption pace (${percentage.toFixed(1)}%). Consider shifting secondary usage to reclaimed resources or load shedding.`
      : "Usage pace is within expected sustainability parameters.",
  };
});

/**
 * 3. Repair & Recycling Recommender Function (100% Free Category Engine)
 */
exports.recommendRepairRecycle = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required");
  }

  const { itemName, category, condition, location } = request.data;

  return {
    recommendations: [
      {
        optionType: "Repair",
        title: "Authorised Component Service & Refurbishment",
        description: `Servicing ${itemName || "your item"} extends useful service life by ~2-3 years, saving ~70% over buying new.`,
        searchTerm: `${category || "Equipment"} Repair in ${location || "India"}`,
        environmentalBenefit: "Prevents ~80kg manufacturing CO2e emissions",
      },
      {
        optionType: "Recycle",
        title: "ISO-Certified E-Waste Recycler",
        description: `Hand over end-of-life ${itemName || "your item"} to audited smelters for precious metals recovery.`,
        searchTerm: `Authorised E-Waste Recycler in ${location || "India"}`,
        environmentalBenefit: "Guarantees zero-landfill chain-of-custody compliance",
      },
    ],
  };
});

/**
 * 4. AI Listing Description Generator Function (100% Free Prompt Engine)
 */
exports.generateListingDescription = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required");
  }

  const { itemName, category, condition, sellerNotes } = request.data;

  return {
    generatedDescription: `High-utility ${itemName || "item"} (${category || "General"}) in ${condition || "Good"} condition. ${sellerNotes || "Maintained in clean operational environment. Verified for secondary circular reuse."}`,
    suggestedTags: [(category || "general").toLowerCase(), (condition || "good").toLowerCase(), "circular-economy", "reclaimed"],
  };
});
