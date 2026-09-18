package com.reloop.organization.marketplace;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import java.util.ArrayList;
import java.util.List;

public class OrganizationListAssetViewModel extends ViewModel {

    private final OrganizationListingRepository repository;
    private final MutableLiveData<List<String>> mediaListLiveData = new MutableLiveData<>(new ArrayList<String>());
    private final MutableLiveData<String> selectedIntentLiveData = new MutableLiveData<>("SELL");
    private final MutableLiveData<String> validationErrorLiveData = new MutableLiveData<>();
    private final MutableLiveData<Boolean> publishSuccessLiveData = new MutableLiveData<>();

    public OrganizationListAssetViewModel() {
        this.repository = new OrganizationListingRepository();
    }

    public LiveData<List<String>> getMediaList() {
        return mediaListLiveData;
    }

    public LiveData<String> getSelectedIntent() {
        return selectedIntentLiveData;
    }

    public LiveData<String> getValidationError() {
        return validationErrorLiveData;
    }

    public LiveData<Boolean> getPublishSuccess() {
        return publishSuccessLiveData;
    }

    public void setIntent(String intent) {
        selectedIntentLiveData.setValue(intent);
    }

    public void addMockPhoto() {
        List<String> current = mediaListLiveData.getValue();
        if (current == null) current = new ArrayList<>();
        if (current.size() < 5) {
            current.add("mock_uri_" + (current.size() + 1));
            mediaListLiveData.setValue(current);
        } else {
            validationErrorLiveData.setValue("Maximum 5 photos allowed.");
        }
    }

    public void removePhoto(int position) {
        List<String> current = mediaListLiveData.getValue();
        if (current != null && position >= 0 && position < current.size()) {
            current.remove(position);
            mediaListLiveData.setValue(current);
        }
    }

    public boolean validateAndPublish(String title, String category, String condition, String qtyStr, String unit, String moqStr, String priceStr, boolean negotiable, String fulfillment, String description) {
        if (title == null || title.trim().length() < 3) {
            validationErrorLiveData.setValue("Enter a valid asset title (min 3 characters).");
            return false;
        }

        int quantity = 0;
        try {
            quantity = Integer.parseInt(qtyStr);
        } catch (Exception e) {
            validationErrorLiveData.setValue("Enter a valid numerical quantity.");
            return false;
        }

        if (quantity < 1) {
            validationErrorLiveData.setValue("Quantity available must be at least 1.");
            return false;
        }

        int minimumOrder = 1;
        try {
            minimumOrder = Integer.parseInt(moqStr);
        } catch (Exception e) {
            validationErrorLiveData.setValue("Enter a valid minimum order quantity.");
            return false;
        }

        if (minimumOrder > quantity) {
            validationErrorLiveData.setValue("Minimum order cannot exceed available quantity.");
            return false;
        }

        String intent = selectedIntentLiveData.getValue();
        double price = 0;
        if ("SELL".equalsIgnoreCase(intent)) {
            try {
                price = Double.parseDouble(priceStr);
            } catch (Exception e) {
                validationErrorLiveData.setValue("Enter a valid price for selling or select GIVE AWAY.");
                return false;
            }
            if (price <= 0) {
                validationErrorLiveData.setValue("Price must be greater than zero when selling.");
                return false;
            }
        }

        String submissionId = "sub_" + System.currentTimeMillis();
        List<String> media = mediaListLiveData.getValue() != null ? mediaListLiveData.getValue() : new ArrayList<String>();

        ListingSubmission submission = new ListingSubmission(
                submissionId,
                "org_shivalik",
                title.trim(),
                category,
                condition,
                quantity,
                unit,
                minimumOrder,
                price,
                negotiable,
                intent,
                fulfillment,
                "Pandesara Unit • Surat, Gujarat",
                description != null ? description.trim() : "",
                "", "", "",
                media,
                "Just now"
        );

        boolean success = repository.publishListing(submission);
        publishSuccessLiveData.setValue(success);
        return success;
    }
}
