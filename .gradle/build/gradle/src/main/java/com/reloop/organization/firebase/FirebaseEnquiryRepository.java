package com.reloop.organization.firebase;

import android.util.Log;

import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.reloop.organization.enquiries.OrgEnquiry;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FirebaseEnquiryRepository {

    private static final String TAG = "FirebaseEnquiryRepo";

    public interface OnEnquiriesLoadedListener {
        void onLoaded(List<OrgEnquiry> list);
        void onError(Exception e);
    }

    public interface OnOperationCompleteListener {
        void onSuccess();
        void onFailure(Exception e);
    }

    public void fetchEnquiries(String orgId, String categoryTab, OnEnquiriesLoadedListener listener) {
        FirebaseOrgManager manager = FirebaseOrgManager.getInstance();
        if (!manager.isInitialized() || manager.getDb() == null) {
            if (listener != null) listener.onLoaded(new ArrayList<>());
            return;
        }

        CollectionReference ref = manager.getDb()
                .collection("organizations")
                .document(orgId)
                .collection("enquiries");

        ref.get().addOnCompleteListener(task -> {
            if (task.isSuccessful() && task.getResult() != null) {
                List<OrgEnquiry> result = new ArrayList<>();
                for (DocumentSnapshot doc : task.getResult()) {
                    try {
                        Boolean declined = doc.getBoolean("isDeclined");
                        String tab = doc.getString("categoryTab");
                        if (declined != null && declined) continue;
                        if (categoryTab != null && !categoryTab.equalsIgnoreCase(tab)) continue;

                        OrgEnquiry enquiry = new OrgEnquiry(
                                doc.getId(),
                                doc.getString("buyerName"),
                                doc.getString("assetTitle"),
                                doc.getString("quantityDisplay"),
                                doc.getString("statusTag"),
                                doc.getString("message"),
                                doc.getString("footerDetails"),
                                doc.getString("timestamp"),
                                tab != null ? tab : "NEW"
                        );
                        result.add(enquiry);
                    } catch (Exception e) {
                        Log.e(TAG, "Error parsing enquiry doc: " + doc.getId(), e);
                    }
                }
                if (listener != null) listener.onLoaded(result);
            } else {
                if (listener != null) listener.onError(task.getException());
            }
        });
    }

    public void declineEnquiry(String orgId, String enquiryId, OnOperationCompleteListener listener) {
        FirebaseOrgManager manager = FirebaseOrgManager.getInstance();
        if (!manager.isInitialized() || manager.getDb() == null) {
            if (listener != null) listener.onSuccess();
            return;
        }

        manager.getDb().collection("organizations")
                .document(orgId)
                .collection("enquiries")
                .document(enquiryId)
                .update("isDeclined", true)
                .addOnSuccessListener(aVoid -> {
                    if (listener != null) listener.onSuccess();
                })
                .addOnFailureListener(e -> {
                    if (listener != null) listener.onFailure(e);
                });
    }

    public void addEnquiry(String orgId, OrgEnquiry enquiry, OnOperationCompleteListener listener) {
        FirebaseOrgManager manager = FirebaseOrgManager.getInstance();
        if (!manager.isInitialized() || manager.getDb() == null) {
            if (listener != null) listener.onSuccess();
            return;
        }

        Map<String, Object> map = new HashMap<>();
        map.put("buyerName", enquiry.getBuyerName());
        map.put("assetTitle", enquiry.getAssetTitle());
        map.put("quantityDisplay", enquiry.getQuantityDisplay());
        map.put("statusTag", enquiry.getStatusTag());
        map.put("message", enquiry.getMessage());
        map.put("footerDetails", enquiry.getFooterDetails());
        map.put("timestamp", enquiry.getTimestamp());
        map.put("categoryTab", enquiry.getCategoryTab());
        map.put("isDeclined", enquiry.isDeclined());

        manager.getDb().collection("organizations")
                .document(orgId)
                .collection("enquiries")
                .document(enquiry.getId())
                .set(map)
                .addOnSuccessListener(aVoid -> {
                    if (listener != null) listener.onSuccess();
                })
                .addOnFailureListener(e -> {
                    if (listener != null) listener.onFailure(e);
                });
    }
}
