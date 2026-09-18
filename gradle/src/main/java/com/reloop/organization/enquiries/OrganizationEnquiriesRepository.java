package com.reloop.organization.enquiries;

import android.content.Context;

import com.reloop.organization.firebase.FirebaseEnquiryRepository;
import com.reloop.organization.firebase.FirebaseOrgManager;
import com.reloop.organization.mock.DataResetManager;

import java.util.ArrayList;
import java.util.List;

public class OrganizationEnquiriesRepository {

    public interface OnEnquiriesCallback {
        void onResult(List<OrgEnquiry> enquiries);
    }

    private final List<OrgEnquiry> localEnquiries;
    private final FirebaseEnquiryRepository firebaseRepository;

    public OrganizationEnquiriesRepository() {
        this.localEnquiries = new ArrayList<>();
        this.firebaseRepository = new FirebaseEnquiryRepository();
    }

    public List<OrgEnquiry> getEnquiriesByCategory(String categoryTab) {
        List<OrgEnquiry> filtered = new ArrayList<>();
        for (OrgEnquiry enquiry : localEnquiries) {
            if (!enquiry.isDeclined() && enquiry.getCategoryTab().equalsIgnoreCase(categoryTab)) {
                filtered.add(enquiry);
            }
        }
        return filtered;
    }

    public void loadEnquiries(Context context, String categoryTab, OnEnquiriesCallback callback) {
        FirebaseOrgManager firebaseManager = FirebaseOrgManager.getInstance();
        if (firebaseManager.isInitialized()) {
            firebaseRepository.fetchEnquiries(firebaseManager.getDefaultOrgId(), categoryTab, new FirebaseEnquiryRepository.OnEnquiriesLoadedListener() {
                @Override
                public void onLoaded(List<OrgEnquiry> list) {
                    if (callback != null) callback.onResult(list);
                }

                @Override
                public void onError(Exception e) {
                    if (callback != null) callback.onResult(getEnquiriesByCategory(categoryTab));
                }
            });
        } else {
            DataResetManager resetManager = new DataResetManager(context);
            if (resetManager.isCleanSlateEnabled()) {
                if (callback != null) callback.onResult(new ArrayList<>());
            } else {
                if (callback != null) callback.onResult(getEnquiriesByCategory(categoryTab));
            }
        }
    }

    public boolean declineEnquiry(String id) {
        for (OrgEnquiry enquiry : localEnquiries) {
            if (enquiry.getId().equals(id)) {
                enquiry.setDeclined(true);
                break;
            }
        }
        FirebaseOrgManager firebaseManager = FirebaseOrgManager.getInstance();
        if (firebaseManager.isInitialized()) {
            firebaseRepository.declineEnquiry(firebaseManager.getDefaultOrgId(), id, null);
        }
        return true;
    }
}
