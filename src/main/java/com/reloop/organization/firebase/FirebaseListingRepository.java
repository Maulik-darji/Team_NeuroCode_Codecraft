package com.reloop.organization.firebase;

import android.net.Uri;
import android.util.Log;

import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.storage.StorageReference;

import com.reloop.organization.marketplace.ListingSubmission;
import com.reloop.organization.marketplace.OrganizationMarketplaceItem;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FirebaseListingRepository {

    private static final String TAG = "FirebaseListingRepo";

    public interface OnListingsLoadedListener {
        void onLoaded(List<OrganizationMarketplaceItem> listings);
        void onError(Exception e);
    }

    public interface OnImageUploadListener {
        void onSuccess(String downloadUrl);
        void onFailure(Exception e);
    }

    public interface OnPublishListener {
        void onSuccess(String listingId);
        void onFailure(Exception e);
    }

    public void uploadAssetImage(String orgId, Uri imageUri, OnImageUploadListener listener) {
        FirebaseOrgManager manager = FirebaseOrgManager.getInstance();
        if (!manager.isInitialized() || manager.getStorage() == null) {
            if (listener != null) listener.onSuccess(imageUri.toString());
            return;
        }

        String path = "organizations/" + orgId + "/assets/" + System.currentTimeMillis() + ".jpg";
        StorageReference fileRef = manager.getStorage().getReference().child(path);

        fileRef.putFile(imageUri)
                .addOnSuccessListener(taskSnapshot -> fileRef.getDownloadUrl()
                        .addOnSuccessListener(uri -> {
                            if (listener != null) listener.onSuccess(uri.toString());
                        })
                        .addOnFailureListener(e -> {
                            if (listener != null) listener.onFailure(e);
                        }))
                .addOnFailureListener(e -> {
                    if (listener != null) listener.onFailure(e);
                });
    }

    public void publishListing(String orgId, ListingSubmission submission, OnPublishListener listener) {
        FirebaseOrgManager manager = FirebaseOrgManager.getInstance();
        if (!manager.isInitialized() || manager.getDb() == null) {
            if (listener != null) listener.onSuccess("LST-LOCAL-" + System.currentTimeMillis());
            return;
        }

        String docId = "LST-" + System.currentTimeMillis();
        Map<String, Object> map = new HashMap<>();
        map.put("title", submission.getTitle());
        map.put("category", submission.getCategory());
        map.put("condition", submission.getCondition());
        map.put("quantityAvailable", submission.getQuantityAvailable());
        map.put("unit", submission.getUnit());
        map.put("minimumOrder", submission.getMinimumOrder());
        map.put("price", submission.getPrice());
        map.put("isNegotiable", submission.isNegotiable());
        map.put("intent", submission.getIntent());
        map.put("fulfillment", submission.getFulfillment());
        map.put("location", submission.getLocation());
        map.put("description", submission.getDescription());
        map.put("imageUris", submission.getImageUris());
        map.put("status", "Available");
        map.put("timestamp", System.currentTimeMillis());

        manager.getDb().collection("organizations")
                .document(orgId)
                .collection("listings")
                .document(docId)
                .set(map)
                .addOnSuccessListener(aVoid -> {
                    if (listener != null) listener.onSuccess(docId);
                })
                .addOnFailureListener(e -> {
                    if (listener != null) listener.onFailure(e);
                });
    }

    public void fetchListings(String orgId, OnListingsLoadedListener listener) {
        FirebaseOrgManager manager = FirebaseOrgManager.getInstance();
        if (!manager.isInitialized() || manager.getDb() == null) {
            if (listener != null) listener.onLoaded(new ArrayList<>());
            return;
        }

        CollectionReference ref = manager.getDb()
                .collection("organizations")
                .document(orgId)
                .collection("listings");

        ref.get().addOnCompleteListener(task -> {
            if (task.isSuccessful() && task.getResult() != null) {
                List<OrganizationMarketplaceItem> list = new ArrayList<>();
                for (DocumentSnapshot doc : task.getResult()) {
                    try {
                        String id = doc.getId();
                        String title = doc.getString("title");
                        String category = doc.getString("category");
                        String condition = doc.getString("condition");
                        Double qty = doc.getDouble("quantityAvailable");
                        String unit = doc.getString("unit");
                        Double price = doc.getDouble("price");
                        String location = doc.getString("location");

                        if (title != null) {
                            String qtyStr = (qty != null ? qty.intValue() : 1) + " " + (unit != null ? unit : "units");
                            String priceStr = (price != null && price > 0) ? String.format("₹%,.0f", price) : "FREE";
                            list.add(new OrganizationMarketplaceItem(
                                    id, title, "Shivalik Textiles",
                                    location != null ? location : "Surat, Gujarat",
                                    category != null ? category : "General",
                                    priceStr, qtyStr,
                                    condition != null ? condition : "Good",
                                    "MOQ 1", "Ex-factory", "Available", true,
                                    category != null ? category.toUpperCase() : "SURPLUS"
                            ));
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Error parsing listing doc: " + doc.getId(), e);
                    }
                }
                if (listener != null) listener.onLoaded(list);
            } else {
                if (listener != null) listener.onError(task.getException());
            }
        });
    }
}
