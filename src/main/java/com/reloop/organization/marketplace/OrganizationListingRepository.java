package com.reloop.organization.marketplace;

import android.net.Uri;

import com.reloop.organization.firebase.FirebaseListingRepository;
import com.reloop.organization.firebase.FirebaseOrgManager;

public class OrganizationListingRepository {

    public interface OnPublishCallback {
        void onSuccess(String listingId);
        void onFailure(Exception e);
    }

    private ListingDraft currentDraft;
    private final FirebaseListingRepository firebaseListingRepo = new FirebaseListingRepository();

    public void saveDraft(ListingDraft draft) {
        this.currentDraft = draft;
    }

    public ListingDraft getDraft() {
        return currentDraft;
    }

    public boolean publishListing(ListingSubmission submission) {
        return publishListingWithCallback(submission, null);
    }

    public boolean publishListingWithCallback(ListingSubmission submission, OnPublishCallback callback) {
        if (submission == null) {
            if (callback != null) callback.onFailure(new IllegalArgumentException("Submission cannot be null"));
            return false;
        }

        // Construct item for local list
        String quantityStr = submission.getQuantityAvailable() + " " + submission.getUnit();
        String moqStr = "MOQ " + submission.getMinimumOrder();
        String categoryTag = submission.getCategory() != null ? submission.getCategory().toUpperCase() : "SURPLUS";

        OrganizationMarketplaceItem newItem = new OrganizationMarketplaceItem(
                submission.getSubmissionId(),
                submission.getTitle(),
                "Shivalik Textiles",
                submission.getLocation(),
                submission.getCategory(),
                submission.getFormattedPrice(),
                quantityStr,
                submission.getCondition(),
                moqStr,
                submission.getFulfillment(),
                "Available",
                true,
                categoryTag
        );

        OrganizationMarketplaceMockData.getMockListings().add(0, newItem);

        FirebaseOrgManager firebaseManager = FirebaseOrgManager.getInstance();
        if (firebaseManager.isInitialized()) {
            firebaseListingRepo.publishListing(firebaseManager.getDefaultOrgId(), submission, new FirebaseListingRepository.OnPublishListener() {
                @Override
                public void onSuccess(String listingId) {
                    currentDraft = null;
                    if (callback != null) callback.onSuccess(listingId);
                }

                @Override
                public void onFailure(Exception e) {
                    if (callback != null) callback.onFailure(e);
                }
            });
        } else {
            currentDraft = null;
            if (callback != null) callback.onSuccess(submission.getSubmissionId());
        }

        return true;
    }

    public void uploadAssetImage(Uri imageUri, FirebaseListingRepository.OnImageUploadListener listener) {
        FirebaseOrgManager firebaseManager = FirebaseOrgManager.getInstance();
        firebaseListingRepo.uploadAssetImage(firebaseManager.getDefaultOrgId(), imageUri, listener);
    }
}
