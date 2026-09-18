package com.reloop.organization.enquiries;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import java.util.List;

public class OrganizationEnquiriesViewModel extends ViewModel {

    private final OrganizationEnquiriesRepository repository;
    private final MutableLiveData<List<OrgEnquiry>> enquiriesLiveData = new MutableLiveData<>();
    private final MutableLiveData<String> actionMessageLiveData = new MutableLiveData<>();
    private String currentCategory = "NEW";

    public OrganizationEnquiriesViewModel() {
        this.repository = new OrganizationEnquiriesRepository();
        loadCategory(currentCategory);
    }

    public LiveData<List<OrgEnquiry>> getEnquiriesLiveData() {
        return enquiriesLiveData;
    }

    public LiveData<String> getActionMessageLiveData() {
        return actionMessageLiveData;
    }

    public void loadCategory(String category) {
        this.currentCategory = category;
        List<OrgEnquiry> result = repository.getEnquiriesByCategory(category);
        enquiriesLiveData.setValue(result);
    }

    public void declineEnquiry(OrgEnquiry enquiry) {
        boolean success = repository.declineEnquiry(enquiry.getId());
        if (success) {
            actionMessageLiveData.setValue("Declined offer from " + enquiry.getBuyerName());
            loadCategory(currentCategory);
        }
    }
}
